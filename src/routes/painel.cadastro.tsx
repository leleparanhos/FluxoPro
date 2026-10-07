import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AlertCircle, ChevronDown, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CATEGORIAS,
  formatBRL,
  localDateISO,
  maskBRL,
  parseBRL,
  useTransactions,
  type TipoTransacao,
} from "@/lib/transactions";

export const Route = createFileRoute("/painel/cadastro")({
  head: () => ({
    meta: [
      { title: "Nova transação — FluxoPro" },
      {
        name: "description",
        content:
          "Cadastre receitas e despesas do seu negócio com valor, categoria e data em poucos toques.",
      },
      { property: "og:title", content: "Nova transação — FluxoPro" },
      {
        property: "og:description",
        content:
          "Cadastre receitas e despesas do seu negócio com valor, categoria e data em poucos toques.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { editar?: string } =>
    typeof s["editar"] === "string" ? { editar: s["editar"] } : {},
  component: Cadastro,
});

const labelCls = "block text-xs font-semibold uppercase text-muted-foreground";
const fieldCls =
  "mt-2 h-14 w-full rounded-2xl border border-input bg-background/45 px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20";

function Cadastro() {
  const { editar } = Route.useSearch();
  const { carregando } = useTransactions();
  if (editar && carregando) return <p className="text-sm text-muted-foreground">Carregando…</p>;
  return <Formulario key={editar ?? "nova"} editar={editar} />;
}

function Formulario({ editar }: { editar?: string | undefined }) {
  const { transactions, addTransaction, updateTransaction } = useTransactions();
  const navigate = useNavigate();
  const emEdicao = editar ? transactions.find((t) => t.id === editar) : undefined;

  const [valor, setValor] = useState(emEdicao ? formatBRL(emEdicao.valor) : "");
  const [descricao, setDescricao] = useState(emEdicao?.descricao ?? "");
  const [tipo, setTipo] = useState<TipoTransacao>(emEdicao?.tipo ?? "receita");
  const [categoria, setCategoria] = useState<string>(emEdicao?.categoria ?? CATEGORIAS[0]);
  const [data, setData] = useState(emEdicao?.data ?? localDateISO());
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);


  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const numero = parseBRL(valor);

    if (numero === null || numero <= 0) {
      setErro("O campo valor não pode ficar vazio");
      return;
    }

    const dados = { valor: numero, tipo, categoria, data, descricao: descricao.trim() };
    setSalvando(true);
    try {
      if (emEdicao) await updateTransaction(emEdicao.id, { ...dados, ...(emEdicao.nome ? { nome: emEdicao.nome } : {}) });
      else await addTransaction(dados);
    } catch {
      setSalvando(false);
      setErro("Não foi possível salvar. Tente novamente.");
      return;
    }

    setErro(null);
    setValor("");
    setDescricao("");
    setTipo("receita");
    setCategoria(CATEGORIAS[0]);
    setData(localDateISO());
    navigate({ to: "/painel/extrato" });
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        {emEdicao ? "Editar transação" : "Nova transação"}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Registre uma entrada ou saída do caixa do seu negócio.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-7 rounded-3xl border border-border bg-card/70 p-5 shadow-card backdrop-blur-xl sm:p-8"
      >
        {/* Valor */}
        <div>
          <label htmlFor="valor" className={labelCls}>
            Valor
          </label>
          <input
            id="valor"
            inputMode="numeric"
            autoComplete="off"
            placeholder="R$ 0,00"
            value={valor}
            onChange={(e) => {
              setValor(maskBRL(e.target.value));
              if (erro) setErro(null);
            }}
            aria-invalid={erro ? true : undefined}
            className={`${fieldCls} font-display text-2xl font-semibold ${
              erro ? "border-danger ring-2 ring-danger/20" : ""
            }`}
          />
          {erro && (
            <p
              role="alert"
              className="mt-2 flex items-center gap-2 rounded-lg bg-danger-soft px-3 py-2 text-sm font-semibold text-danger"
            >
              <AlertCircle size={16} aria-hidden="true" />
              {erro}
            </p>
          )}
        </div>

        <div className="mt-6">
          <label htmlFor="descricao" className={labelCls}>Descrição</label>
          <input
            id="descricao"
            type="text"
            maxLength={120}
            placeholder="Ex.: Compra de tintas"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={fieldCls}
          />
        </div>

        {/* Tipo */}
        <div className="mt-6">
          <span className={labelCls}>Tipo</span>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setTipo("receita")}
              aria-pressed={tipo === "receita"}
              className={`h-13 rounded-2xl border px-4 text-sm font-semibold ${
                tipo === "receita"
                  ? "border-success bg-success-soft text-success"
                  : "border-border bg-card text-muted-foreground hover:border-success/40"
              }`}
            >
              Receita
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => setTipo("despesa")}
              aria-pressed={tipo === "despesa"}
              className={`h-13 rounded-2xl border px-4 text-sm font-semibold ${
                tipo === "despesa"
                  ? "border-danger bg-danger-soft text-danger"
                  : "border-border bg-card text-muted-foreground hover:border-danger/40"
              }`}
            >
              Despesa
            </Button>
          </div>
        </div>

        {/* Categoria */}
        <div className="mt-6">
          <label htmlFor="categoria" className={labelCls}>
            Categoria
          </label>
          <div className="relative"><select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={`${fieldCls} appearance-none pr-11`}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-muted-foreground" size={18} /></div>
        </div>

        {/* Data */}
        <div className="mt-6">
          <label htmlFor="data" className={labelCls}>
            Data
          </label>
          <div><input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={`${fieldCls} native-date [color-scheme:dark]`}
          /></div>
        </div>

        <Button
          type="submit"
          disabled={salvando}
          className="mt-8 h-14 w-full rounded-2xl font-display text-base font-semibold shadow-lift"
        >
          <Save size={18} />
          {emEdicao ? "Salvar alterações" : "Salvar transação"}
        </Button>
      </form>
    </div>
  );
}
