import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { formatBRL, useTransactions } from "@/lib/transactions";

export const Route = createFileRoute("/painel/graficos")({
  head: () => ({ meta: [
    { title: "Gráficos — FluxoPro" },
    { name: "description", content: "Compare receitas e despesas e veja para onde vai o dinheiro do caixa." },
    { property: "og:title", content: "Gráficos — FluxoPro" },
    { property: "og:description", content: "Compare receitas e despesas e veja para onde vai o dinheiro do caixa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Graficos,
});

const CORES = Array.from({ length: 6 }, (_, i) => `var(--chart-category-${i + 1})`);
const card = "rounded-3xl border border-border bg-card/70 p-5 shadow-card backdrop-blur-xl";
const tip = {
  contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" },
  labelStyle: { color: "var(--foreground)", fontWeight: 700 },
  itemStyle: { color: "var(--foreground)" },
  formatter: (v: unknown) => formatBRL(Number(v)),
};

function Graficos() {
  const { transactions } = useTransactions();
  const { barras, pizza } = useMemo(() => {
    const r = transactions.filter((t) => t.tipo === "receita").reduce((s, t) => s + t.valor, 0);
    const d = transactions.filter((t) => t.tipo === "despesa").reduce((s, t) => s + t.valor, 0);
    const porCat = new Map<string, number>();
    transactions.filter((t) => t.tipo === "despesa").forEach((t) => porCat.set(t.categoria, (porCat.get(t.categoria) ?? 0) + t.valor));
    return { barras: [{ nome: "Receitas", valor: r }, { nome: "Despesas", valor: d }], pizza: [...porCat].map(([nome, valor]) => ({ nome, valor })) };
  }, [transactions]);

  return <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold text-foreground">Gráficos</h1>
    <section className={card}>
      <h2 className="font-display text-base font-bold">Receitas x Despesas</h2>
      <div className="mt-4 h-64"><ResponsiveContainer><BarChart data={barras}>
        <XAxis dataKey="nome" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
        <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} width={70} tickFormatter={(v) => `R$ ${Number(v).toLocaleString("pt-BR")}`} />
        <Tooltip cursor={{ fill: "var(--muted)" }} {...tip} />
        <Bar dataKey="valor" radius={[10, 10, 0, 0]}>
          <Cell fill="var(--success)" /><Cell fill="var(--danger)" />
        </Bar>
      </BarChart></ResponsiveContainer></div>
    </section>
    <section className={card}>
      <h2 className="font-display text-base font-bold">Despesas por categoria</h2>
      {pizza.length ? <div className="mt-4 h-72"><ResponsiveContainer><PieChart>
        <Pie data={pizza} dataKey="valor" nameKey="nome" innerRadius="55%" outerRadius="80%" paddingAngle={3} stroke="none">
          {pizza.map((p, i) => <Cell key={p.nome} fill={CORES[i % CORES.length] ?? "var(--chart-category-1)"} />)}
        </Pie>
        <Tooltip {...tip} />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }} />
      </PieChart></ResponsiveContainer></div> : <p className="mt-4 text-sm text-muted-foreground">Nenhuma despesa neste caixa.</p>}
    </section>
  </div>;
}
