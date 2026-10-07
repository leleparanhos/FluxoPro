import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { TransactionCard } from "@/components/transaction-card";
import { formatBRL, useTransactions } from "@/lib/transactions";

export const Route = createFileRoute("/painel/")({
  head: () => ({ meta: [
    { title: "Início — FluxoPro" },
    { name: "description", content: "Acompanhe o saldo, as entradas e as saídas do seu caixa." },
    { property: "og:title", content: "Início — FluxoPro" },
    { property: "og:description", content: "Acompanhe o saldo, as entradas e as saídas do seu caixa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Inicio,
});

function Inicio() {
  const { transactions } = useTransactions();
  const receitas = transactions.filter((t) => t.tipo === "receita").reduce((s, t) => s + t.valor, 0);
  const despesas = transactions.filter((t) => t.tipo === "despesa").reduce((s, t) => s + t.valor, 0);
  const recentes = transactions.map((transaction, index) => ({ transaction, index })).sort((a, b) => b.transaction.data.localeCompare(a.transaction.data) || b.index - a.index).slice(0, 3).map(({ transaction }) => transaction);
  return <div>
    <section>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold text-foreground">Resumo financeiro</h1>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="col-span-2 rounded-3xl border border-primary/30 bg-card/75 p-6 shadow-lift backdrop-blur-xl sm:p-8">
          <p className="text-sm font-medium text-muted-foreground">Saldo Final</p>
          <p className={`mt-2 break-words font-display text-4xl font-bold sm:text-5xl ${receitas - despesas >= 0 ? "text-primary" : "text-danger"}`}>{formatBRL(receitas - despesas)}</p>
        </div>
        <Summary icon={ArrowDownLeft} label="Total de Receitas" value={receitas} tone="success" />
        <Summary icon={ArrowUpRight} label="Total de Despesas" value={despesas} tone="danger" />
      </div>
    </section>
    <section className="mt-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0"><h2 className="font-display text-xl font-bold">Movimentações recentes</h2><p className="mt-1 text-sm text-muted-foreground">Seu caixa em um só olhar</p></div>
        <Link to="/painel/extrato" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">Ver extrato <ArrowRight size={16} /></Link>
      </div>
      <ul className="mt-4 space-y-3">{recentes.map((t) => <TransactionCard key={t.id} transaction={t} />)}{!recentes.length && <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhuma movimentação neste caixa.</li>}</ul>
    </section>
  </div>;
}

function Summary({ icon: Icon, label, value, tone }: { icon: typeof ArrowDownLeft; label: string; value: number; tone: "success" | "danger" }) {
  return <div className="min-w-0 rounded-2xl border border-border bg-card/70 p-4 shadow-card sm:p-5">
    <div className={`flex items-center gap-2 text-xs font-semibold ${tone === "success" ? "text-success" : "text-danger"}`}><Icon size={16} />{label}</div>
    <p className="mt-2 break-words font-display text-base font-bold text-foreground sm:text-lg">{formatBRL(value)}</p>
  </div>;
}
