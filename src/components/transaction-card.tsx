import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from "lucide-react";

import {
  LABEL_TIPO,
  formatBRL,
  formatData,
  useTransactions,
  type Transacao,
} from "@/lib/transactions";

export function TransactionCard({ transaction }: { transaction: Transacao }) {
  const { removeTransaction } = useTransactions();
  const receita = transaction.tipo === "receita";
  const Icon = receita ? ArrowDownLeft : ArrowUpRight;

  return (
    <li className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card/70 p-4 shadow-card backdrop-blur-xl transition-colors hover:bg-card">
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-xl ${
          receita ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
        }`}
      >
        <Icon size={19} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground">
          {transaction.nome ?? transaction.categoria}
        </span>
        <span className="mt-1 block truncate text-xs text-muted-foreground">
          {transaction.categoria} · {formatData(transaction.data)}
        </span>
        {transaction.descricao && (
          <span className="mt-1 block break-words text-xs text-foreground/80">
            {transaction.descricao}
          </span>
        )}
      </span>
      <span className="text-right">
        <span className={`block whitespace-nowrap font-display text-sm font-bold ${receita ? "text-success" : "text-danger"}`}>
          {receita ? "+" : "−"} {formatBRL(transaction.valor)}
        </span>
        <span className="mt-1 block text-[10px] font-semibold uppercase text-muted-foreground">
          {LABEL_TIPO[transaction.tipo]}
        </span>
        <span className="mt-2 flex justify-end gap-1">
          <Link to="/painel/cadastro" search={{ editar: transaction.id }} aria-label="Editar transação" className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Pencil size={15} />
          </Link>
          <button type="button" onClick={() => removeTransaction(transaction.id).catch(() => toast.error("Não foi possível excluir"))} aria-label="Excluir transação" className="grid size-8 place-items-center rounded-lg text-danger/80 transition-colors hover:bg-danger-soft hover:text-danger">
            <Trash2 size={15} />
          </button>
        </span>
      </span>
    </li>
  );
}