import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const soDigitos = (s: string) => s.replace(/\D/g, "");

const EPHEMERAL = "fluxopro_sessao_temporaria";
const ALIVE = "fluxopro_aba_ativa";

export interface CadastroDados {
  nome: string;
  documento: string;
  email: string;
  nascimento: string;
  empresa?: string;
  senha: string;
}

interface AuthValue {
  user: User | null;
  carregando: boolean;
  cadastrar: (u: CadastroDados) => Promise<string | null>;
  entrar: (email: string, senha: string, manter: boolean) => Promise<string | null>;
  sair: () => Promise<void>;
  recuperar: (email: string) => Promise<void>;
  atualizarMetadados: (data: Record<string, unknown>) => Promise<string | null>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    (async () => {
      // "Manter conectado" desmarcado: encerra a sessão quando o navegador foi fechado.
      if (localStorage.getItem(EPHEMERAL) && !sessionStorage.getItem(ALIVE)) {
        localStorage.removeItem(EPHEMERAL);
        await supabase.auth.signOut({ scope: "local" });
      }
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setCarregando(false);
    })();
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthValue>(() => ({
    user,
    carregando,
    cadastrar: async (u) => {
      const { error } = await supabase.auth.signUp({
        email: u.email.trim(),
        password: u.senha,
        options: {
          emailRedirectTo: window.location.origin + "/login",
          data: { nome: u.nome, documento: soDigitos(u.documento), nascimento: u.nascimento, empresa: u.empresa ?? null },
        },
      });
      if (error) return /registered/i.test(error.message) ? "Este e-mail já está cadastrado" : error.message;
      return null;
    },
    entrar: async (email, senha, manter) => {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
      if (error) return /confirm/i.test(error.message) ? "Confirme seu e-mail antes de entrar" : "E-mail ou senha incorretos";
      if (manter) localStorage.removeItem(EPHEMERAL);
      else localStorage.setItem(EPHEMERAL, "1");
      sessionStorage.setItem(ALIVE, "1");
      return null;
    },
    sair: async () => {
      localStorage.removeItem(EPHEMERAL);
      await supabase.auth.signOut();
    },
    recuperar: async (email) => {
      await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    },
    atualizarMetadados: async (data) => {
      const { data: r, error } = await supabase.auth.updateUser({ data });
      if (error) return error.message;
      if (r.user) setUser(r.user);
      return null;
    },
  }), [user, carregando]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
