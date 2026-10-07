import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { BarChart3, Home, List, Plus, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/lib/transactions";

export const Route = createFileRoute("/painel")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  component: PainelLayout,
});

function PainelLayout() {
  const { perfil, setPerfil } = useTransactions();
  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-20 border-b border-border bg-background/75 backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="truncate font-display text-lg font-bold text-foreground">
              Fluxo<span className="text-primary">Pro</span>
            </span>
          </Link>
          <div className="grid shrink-0 grid-cols-2 rounded-full border border-border bg-card/70 p-1" role="group" aria-label="Visualização do caixa">
            {(["empresarial", "pessoal"] as const).map((item) => <Button key={item} type="button" variant="ghost" size="sm" aria-pressed={perfil === item} onClick={() => setPerfil(item)} className={`h-8 rounded-full px-3 text-xs font-semibold capitalize transition-colors ${perfil === item ? "bg-primary text-primary-foreground shadow-card hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground"}`}>{item}</Button>)}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-card backdrop-blur-2xl" aria-label="Navegação principal">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end">
          <NavItem to="/painel" icon={Home} label="Início" />
          <NavItem to="/painel/extrato" icon={List} label="Extrato" />
          <Button asChild variant="ghost" className="group h-auto rounded-full p-0 text-primary hover:bg-transparent hover:text-primary"><Link to="/painel/cadastro" aria-label="Nova transação" className="flex flex-col items-center gap-1">
            <span className="grid size-14 -translate-y-3 place-items-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lift transition-transform group-active:scale-95"><Plus size={26} strokeWidth={2.5} /></span>
            <span className="-mt-2 text-[11px] font-semibold">Nova</span>
          </Link></Button>
          <NavItem to="/painel/graficos" icon={BarChart3} label="Gráficos" />
          <NavItem to="/painel/perfil" icon={User} label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon: Icon, label }: { to: "/painel" | "/painel/extrato" | "/painel/graficos" | "/painel/perfil"; icon: typeof Home; label: string }) {
  return <Link to={to} activeOptions={{ exact: true }} className="flex flex-col items-center gap-1 py-1 text-muted-foreground" activeProps={{ className: "flex flex-col items-center gap-1 py-1 text-primary" }}><Icon size={21} /><span className="text-[11px] font-semibold">{label}</span></Link>;
}
