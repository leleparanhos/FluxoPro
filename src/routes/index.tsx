import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FluxoPro — Controle financeiro para pequenos negócios" },
      {
        name: "description",
        content:
          "Organize receitas e despesas do seu negócio em minutos. Extrato claro, exportação em CSV e zero complicação.",
      },
      { property: "og:title", content: "FluxoPro — Controle financeiro para pequenos negócios" },
      {
        property: "og:description",
        content:
          "Organize receitas e despesas do seu negócio em minutos. Extrato claro, exportação em CSV e zero complicação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/70" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex items-center gap-2.5">
          <Logo size={38} />
          <span className="font-display text-xl font-bold text-foreground">
            Fluxo<span className="text-primary">Pro</span>
          </span>
        </header>
        <main className="flex flex-1 items-center py-14">
          <section className="max-w-3xl">
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-foreground sm:text-6xl">
              Sua empresa no <span className="text-primary">verde</span>, todos os dias
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Controle cada real que entra e sai do seu caixa com um app feito para quem não tem tempo a perder. Simples, rápido e direto ao ponto.
            </p>
            <Button asChild size="lg" className="mt-9 h-14 rounded-2xl px-7 font-display text-base shadow-lift">
              <Link to="/login"><span>Começar agora</span><ArrowRight aria-hidden="true" /></Link>
            </Button>
          </section>
        </main>
      </div>
    </div>
  );
}
