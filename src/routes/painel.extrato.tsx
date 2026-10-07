import { createFileRoute } from "@tanstack/react-router";
import { Download, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { TransactionCard } from "@/components/transaction-card";
import { Button } from "@/components/ui/button";
import { baixarCSV } from "@/lib/csv";
import { CATEGORIAS, localDateISO, useTransactions, type TipoTransacao } from "@/lib/transactions";

export const Route = createFileRoute("/painel/extrato")({
  head: () => ({ meta: [
    { title: "Extrato e filtros — FluxoPro" },
    { name: "description", content: "Filtre as entradas e saídas do caixa e exporte exatamente o que está visível." },
    { property: "og:title", content: "Extrato e filtros — FluxoPro" },
    { property: "og:description", content: "Filtre as entradas e saídas do caixa e exporte exatamente o que está visível." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Extrato,
});

type Periodo = "todos" | "7dias" | "mes" | "personalizado";

function Extrato() {
  const { transactions } = useTransactions();
  const [tipo, setTipo] = useState<"todos" | TipoTransacao>("todos");
  const [categoria, setCategoria] = useState("todas");
  const [periodo, setPeriodo] = useState<Periodo>("todos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const visiveis = useMemo(() => {
    const hoje = new Date(`${localDateISO()}T12:00:00`);
    const seteDias = new Date(hoje); seteDias.setDate(hoje.getDate() - 6);
    const inicioMes = localDateISO(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    const inicioSete = localDateISO(seteDias);
    const dataHoje = localDateISO(hoje);
    return transactions.map((transaction, index) => ({ transaction, index }))
      .filter(({ transaction: t }) => tipo === "todos" || t.tipo === tipo)
      .filter(({ transaction: t }) => categoria === "todas" || t.categoria === categoria)
       .filter(({ transaction: t }) => {
         if (periodo === "todos") return true;
         if (periodo === "personalizado") return (!dataInicio || t.data >= dataInicio) && (!dataFim || t.data <= dataFim);
         return periodo === "7dias" ? t.data >= inicioSete && t.data <= dataHoje : t.data >= inicioMes && t.data <= dataHoje;
       })
      .sort((a, b) => b.transaction.data.localeCompare(a.transaction.data) || b.index - a.index)
      .map(({ transaction }) => transaction);
  }, [transactions, tipo, categoria, periodo, dataInicio, dataFim]);

  return <div>
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
      <div className="min-w-0"><h1 className="font-display text-2xl font-bold sm:text-3xl">Extrato</h1><p className="mt-1.5 text-sm text-muted-foreground">{visiveis.length} {visiveis.length === 1 ? "movimentação visível" : "movimentações visíveis"}</p></div>
      <Button variant="outline" onClick={() => baixarCSV(visiveis)} disabled={!visiveis.length} className="h-11 shrink-0 rounded-xl border-border bg-card/70 px-3 sm:px-4"><Download size={17} /><span className="hidden sm:inline">Exportar CSV</span><span className="sm:hidden">CSV</span></Button>
    </div>

    <section className="mt-7 rounded-3xl border border-border bg-card/70 p-4 shadow-card backdrop-blur-xl sm:p-5">
      <div className="flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal size={17} className="text-primary" />Filtros</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Filter label="Tipo" value={tipo} onChange={(v) => setTipo(v as typeof tipo)} options={[["todos", "Todos"], ["receita", "Receita"], ["despesa", "Despesa"]]} />
        <Filter label="Categoria" value={categoria} onChange={setCategoria} options={[["todas", "Todas"], ...CATEGORIAS.map((c) => [c, c] as [string, string])]} />
         <Filter label="Período" value={periodo} onChange={(v) => setPeriodo(v as Periodo)} options={[["todos", "Todo o período"], ["7dias", "Últimos 7 dias"], ["mes", "Este mês"], ["personalizado", "Intervalo de Datas"]]} />
      </div>
       {periodo === "personalizado" && <div className="mt-4 grid grid-cols-2 gap-3">
         <label className="min-w-0 text-xs font-semibold text-muted-foreground">De<input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="native-date mt-2 h-11 w-full min-w-0 rounded-xl border border-input bg-background/50 px-3 text-sm text-foreground outline-none [color-scheme:dark] focus:border-primary" /></label>
         <label className="min-w-0 text-xs font-semibold text-muted-foreground">Até<input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="native-date mt-2 h-11 w-full min-w-0 rounded-xl border border-input bg-background/50 px-3 text-sm text-foreground outline-none [color-scheme:dark] focus:border-primary" /></label>
       </div>}
    </section>

    <ul className="mt-5 space-y-3">{visiveis.map((t) => <TransactionCard key={t.id} transaction={t} />)}{!visiveis.length && <li className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Nenhuma movimentação corresponde aos filtros.</li>}</ul>
  </div>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return <label className="text-xs font-semibold text-muted-foreground">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background/50 px-3 text-sm text-foreground outline-none focus:border-primary">{options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}</select></label>;
}