import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Aviso, AuthShell, Field } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Entrar — FluxoPro" },
    { name: "description", content: "Acesse seu caixa no FluxoPro com e-mail e senha." },
    { property: "og:title", content: "Entrar — FluxoPro" },
    { property: "og:description", content: "Acesse seu caixa no FluxoPro com e-mail e senha." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Login,
});

function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [senha, setSenha] = useState("");
  const [manter, setManter] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !senha) return setErro("Preencha e-mail e senha");
    setEnviando(true);
    const falha = await entrar(email, senha, manter);
    setEnviando(false);
    if (falha) return setErro(falha);
    navigate({ to: "/painel" });
  }

  return (
    <AuthShell title="Entrar" subtitle="Acesse o caixa do seu negócio.">
      <form onSubmit={submit} noValidate>
        <Field label="E-mail" type="email" autoComplete="email" placeholder="voce@empresa.com" value={email} onChange={(e) => { setEmail(e.target.value); setErro(null); }} />
        <Field label="Senha" type="password" autoComplete="current-password" placeholder="Sua senha" value={senha} onChange={(e) => { setSenha(e.target.value); setErro(null); }} />
        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" checked={manter} onChange={(e) => setManter(e.target.checked)} className="size-4 accent-primary" />
            Manter conectado
          </label>
          <Link to="/esqueci-senha" className="font-semibold text-muted-foreground hover:text-primary">Esqueci a senha</Link>
        </div>
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        <Button type="submit" disabled={enviando} className="mt-6 h-14 w-full rounded-2xl font-display text-base shadow-lift"><LogIn size={18} />Entrar</Button>
        <p className="mt-5 text-center text-sm text-muted-foreground">Ainda não tem conta? <Link to="/cadastro-conta" className="font-semibold text-primary">Cadastrar-se</Link></p>
      </form>
    </AuthShell>
  );
}
