import { LABEL_TIPO, formatData, type Transacao } from "@/lib/transactions";

export function baixarCSV(transacoes: Transacao[]) {
  const linhas = [
    ["Data", "Descrição", "Categoria", "Tipo", "Valor"],
    ...transacoes.map((t) => [
      formatData(t.data),
      t.descricao || t.nome || t.categoria,
      t.categoria,
      LABEL_TIPO[t.tipo],
      (t.tipo === "despesa" ? -t.valor : t.valor).toFixed(2).replace(".", ","),
    ]),
  ];
  const csv = linhas
    .map((linha) => linha.map((campo) => `"${String(campo).replace(/"/g, '""')}"`).join(";"))
    .join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fluxopro-extrato-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}