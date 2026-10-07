import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Logo } from "@/components/logo";

export const authField =
  "mt-2 h-13 w-full rounded-2xl border border-input bg-background/45 px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 [color-scheme:dark]";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-5 py-6 sm:px-8">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-primary/70" />
      <header className="mx-auto flex max-w-md items-center gap-2.5">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={34} />
          <span className="font-display text-lg font-bold text-foreground">Fluxo<span className="text-primary">Pro</span></span>
        </Link>
      </header>
      <main className="mx-auto max-w-md py-10">
        <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-7 rounded-3xl border border-border bg-card/70 p-5 shadow-card backdrop-blur-xl sm:p-7">{children}</div>
      </main>
    </div>
  );
}

export function Field({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="mt-5 block first:mt-0 text-xs font-semibold uppercase text-muted-foreground">
      {label}
      <input {...props} className={`${authField} normal-case`} />
    </label>
  );
}

export function Aviso({ tipo, children }: { tipo: "erro" | "sucesso"; children: ReactNode }) {
  const erro = tipo === "erro";
  const Icon = erro ? AlertCircle : CheckCircle2;
  return (
    <p role={erro ? "alert" : "status"} className={`mt-5 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${erro ? "bg-danger-soft text-danger" : "bg-success-soft text-success"}`}>
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
