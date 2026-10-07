import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Aviso, AuthShell, Field } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { soDigitos, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/cadastro-conta")({
  head: () => ({ meta: [
    { title: "Criar conta — FluxoPro" },
    { name: "description", content: "Crie sua conta no FluxoPro e comece a controlar o fluxo de caixa." },
    { property: "og:title", content: "Criar conta — FluxoPro" },
    { property: "og:description", content: "Crie sua conta no FluxoPro e comece a controlar o fluxo de caixa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: CriarConta,
});

function idade(nasc: string) {
  const n = new Date(`${nasc}T12:00:00`);
  const h = new Date();
  let a = h.getFullYear() - n.getFullYear();
  if (h.getMonth() < n.getMonth() || (h.getMonth() === n.getMonth() && h.getDate() < n.getDate())) a--;
  return a;
}

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  documento: z.string().refine((v) => [11, 14].includes(soDigitos(v).length), "CPF deve ter 11 dígitos ou CNPJ 14"),
  email: z.string().trim().email("E-mail inválido").max(255),
  nascimento: z.string().min(1, "Informe a data de nascimento").refine((v) => idade(v) >= 14, "É preciso ter pelo menos 14 anos"),
  empresa: z.string().trim().max(100).optional(),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").max(72),
  confirmar: z.string(),
}).refine((d) => d.senha === d.confirmar, { message: "As senhas não são idênticas", path: ["confirmar"] });

function CriarConta() {
  const { cadastrar } = useAuth();
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [f, setF] = useState({ nome: "", documento: "", email: "", nascimento: "", empresa: "", senha: "", confirmar: "" });
  const [erro, setErro] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: e.target.value }); setErro(null); };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) return setErro(r.error.issues[0]?.message ?? "Verifique os campos");
    setEnviando(true);
    const falha = await cadastrar({ nome: r.data.nome, documento: r.data.documento, email: r.data.email, nascimento: r.data.nascimento, ...(r.data.empresa ? { empresa: r.data.empresa } : {}), senha: r.data.senha });
    setEnviando(false);
    if (falha) return setErro(falha);
    setEnviado(true);
  }

  return (
    <AuthShell title="Criar conta" subtitle="Leva menos de um minuto.">
      {enviado ? <div><Aviso tipo="sucesso">Conta criada! Enviamos um link de confirmação para o seu e-mail. Confirme para poder entrar.</Aviso><p className="mt-5 text-center text-sm"><Link to="/login" className="font-semibold text-primary">Ir para o login</Link></p></div> : <form onSubmit={submit} noValidate>
        <Field label="Nome" autoComplete="name" value={f.nome} onChange={set("nome")} />
        <Field label="CPF/CNPJ" inputMode="numeric" value={f.documento} onChange={set("documento")} placeholder="Somente números" />
        <Field label="Email" type="email" autoComplete="email" value={f.email} onChange={set("email")} />
        <Field label="Data de nascimento" type="date" value={f.nascimento} onChange={set("nascimento")} />
        <Field label="Nome da empresa (opcional)" value={f.empresa} onChange={set("empresa")} />
        <Field label="Senha" type="password" autoComplete="new-password" value={f.senha} onChange={set("senha")} />
        <Field label="Confirmar senha" type="password" autoComplete="new-password" value={f.confirmar} onChange={set("confirmar")} />
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        <Button type="submit" disabled={enviando} className="mt-6 h-14 w-full rounded-2xl font-display text-base shadow-lift"><UserPlus size={18} />Criar Conta</Button>
        <p className="mt-5 text-center text-sm text-muted-foreground">Já tem conta? <Link to="/login" className="font-semibold text-primary">Entrar</Link></p>
      </form>}
    </AuthShell>
  );
}
