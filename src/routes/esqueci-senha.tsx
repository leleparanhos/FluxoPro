import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Aviso, AuthShell, Field } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({ meta: [
    { title: "Recuperar senha — FluxoPro" },
    { name: "description", content: "Receba um link para redefinir a senha da sua conta FluxoPro." },
    { property: "og:title", content: "Recuperar senha — FluxoPro" },
    { property: "og:description", content: "Receba um link para redefinir a senha da sua conta FluxoPro." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Recuperar,
});

const MSG = "Se o e-mail estiver cadastrado, você receberá um link de recuperação na sua caixa de entrada";

function Recuperar() {
  const { recuperar } = useAuth();
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErro("Informe um e-mail válido");
    setEnviando(true);
    try { await recuperar(email); } catch { /* resposta neutra */ }
    setEnviando(false);
    toast.success(MSG);
  }

  return (
    <AuthShell title="Recuperar senha" subtitle="Enviaremos um link para o seu e-mail.">
      <form onSubmit={enviar} noValidate>
        <Field label="E-mail cadastrado" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setErro(null); }} />
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        <Button type="submit" disabled={enviando} className="mt-6 h-14 w-full rounded-2xl font-display text-base shadow-lift"><Mail size={18} />Enviar link</Button>
      </form>
      <p className="mt-5 text-center text-sm"><Link to="/login" className="font-semibold text-muted-foreground hover:text-primary">Voltar ao login</Link></p>
    </AuthShell>
  );
}
