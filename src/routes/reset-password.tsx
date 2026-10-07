import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Aviso, AuthShell, Field } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Nova senha — FluxoPro" },
    { name: "description", content: "Defina uma nova senha para sua conta FluxoPro." },
    { property: "og:title", content: "Nova senha — FluxoPro" },
    { property: "og:description", content: "Defina uma nova senha para sua conta FluxoPro." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: NovaSenha,
});

function NovaSenha() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (senha.length < 6) return setErro("A senha deve ter pelo menos 6 caracteres");
    if (senha !== confirmar) return setErro("As senhas não são idênticas");
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) return setErro("Link inválido ou expirado. Solicite um novo.");
    toast.success("Senha atualizada!");
    navigate({ to: "/painel" });
  }

  return (
    <AuthShell title="Nova senha" subtitle="Escolha uma senha nova para entrar.">
      <form onSubmit={salvar} noValidate>
        <Field label="Nova senha" type="password" autoComplete="new-password" value={senha} onChange={(e) => { setSenha(e.target.value); setErro(null); }} />
        <Field label="Confirmar nova senha" type="password" autoComplete="new-password" value={confirmar} onChange={(e) => { setConfirmar(e.target.value); setErro(null); }} />
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        <Button type="submit" className="mt-6 h-14 w-full rounded-2xl font-display text-base shadow-lift"><KeyRound size={18} />Salvar nova senha</Button>
      </form>
    </AuthShell>
  );
}
