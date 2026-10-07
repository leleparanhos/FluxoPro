import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type TipoTransacao = "receita" | "despesa";
export type PerfilCaixa = "empresarial" | "pessoal";

export interface Transacao {
  id: string;
  nome?: string;
  descricao?: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: string;
  /** Data local no formato YYYY-MM-DD */
  data: string;
}

export const CATEGORIAS = [
  "Consultorias/Serviços",
  "Vendas de Produtos",
  "Insumos/Materiais",
  "Marketing",
  "Ferramentas",
  "Assinaturas",
] as const;

export const LABEL_TIPO: Record<TipoTransacao, string> = {
  receita: "Receita",
  despesa: "Despesa",
};

export function localDateISO(d = new Date()) {
  const offsetMs = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 10);
}

export function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Converte o texto mascarado do input (ex.: "R$ 1.234,56") de volta para número. */
export function parseBRL(texto: string): number | null {
  const digitos = texto.replace(/\D/g, "");
  if (!digitos) return null;
  return parseInt(digitos, 10) / 100;
}

/** Máscara de moeda: mantém apenas dígitos e formata como BRL enquanto digita. */
export function maskBRL(texto: string) {
  const digitos = texto.replace(/\D/g, "").slice(0, 11);
  if (!digitos) return "";
  return formatBRL(parseInt(digitos, 10) / 100);
}

export function formatData(iso: string) {
  return iso.split("-").reverse().join("/");
}

interface TransactionsContextValue {
  transactions: Transacao[];
  carregando: boolean;
  addTransaction: (t: Omit<Transacao, "id">) => Promise<void>;
  updateTransaction: (id: string, t: Omit<Transacao, "id">) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  perfil: PerfilCaixa;
  setPerfil: (perfil: PerfilCaixa) => void;
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

type Linha = { id: string; perfil: string; nome: string | null; descricao: string | null; valor: number; tipo: string; categoria: string; data: string };

function deLinha(r: Linha): Transacao & { perfil: PerfilCaixa } {
  return {
    id: r.id,
    perfil: r.perfil as PerfilCaixa,
    ...(r.nome ? { nome: r.nome } : {}),
    ...(r.descricao ? { descricao: r.descricao } : {}),
    valor: Number(r.valor),
    tipo: r.tipo as TipoTransacao,
    categoria: r.categoria,
    data: r.data,
  };
}

const paraLinha = (t: Omit<Transacao, "id">) => ({
  nome: t.nome ?? null,
  descricao: t.descricao || null,
  valor: t.valor,
  tipo: t.tipo,
  categoria: t.categoria,
  data: t.data,
});

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [perfil, setPerfil] = useState<PerfilCaixa>("empresarial");
  const key = ["transactions", user?.id ?? "anon"];

  const { data = [], isLoading } = useQuery({
    queryKey: key,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, perfil, nome, descricao, valor, tipo, categoria, data")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as Linha[]).map(deLinha);
    },
  });

  const transactions = useMemo(() => data.filter((t) => t.perfil === perfil), [data, perfil]);
  const refresh = () => qc.invalidateQueries({ queryKey: key });

  const addTransaction = async (t: Omit<Transacao, "id">) => {
    const { error } = await supabase.from("transactions").insert({ ...paraLinha(t), perfil });
    if (error) throw error;
    await refresh();
  };
  const updateTransaction = async (id: string, t: Omit<Transacao, "id">) => {
    const { error } = await supabase.from("transactions").update(paraLinha(t)).eq("id", id);
    if (error) throw error;
    await refresh();
  };
  const removeTransaction = async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) throw error;
    await refresh();
  };

  const value = {
    transactions,
    carregando: !!user && isLoading,
    addTransaction,
    updateTransaction,
    removeTransaction,
    perfil,
    setPerfil,
  };

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions deve ser usado dentro de TransactionsProvider");
  return ctx;
}
