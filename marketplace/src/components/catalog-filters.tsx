import { ESFERAS, ESTADOS, NATUREZAS, TIPOS_ATIVO } from "@/lib/constants";

export function CatalogFilters({
  current,
}: {
  current: Record<string, string | undefined>;
}) {
  return (
    <form
      method="GET"
      className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-white p-5 sm:grid-cols-3 lg:grid-cols-6"
    >
      <Select name="tipoAtivo" label="Tipo" defaultValue={current.tipoAtivo}>
        <option value="">Todos</option>
        {TIPOS_ATIVO.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>

      <Select name="esfera" label="Esfera" defaultValue={current.esfera}>
        <option value="">Todas</option>
        {ESFERAS.map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </Select>

      <Select name="natureza" label="Natureza" defaultValue={current.natureza}>
        <option value="">Todas</option>
        {NATUREZAS.map((n) => (
          <option key={n.value} value={n.value}>
            {n.label}
          </option>
        ))}
      </Select>

      <Select name="estado" label="Estado" defaultValue={current.estado}>
        <option value="">Todos</option>
        {ESTADOS.map((uf) => (
          <option key={uf} value={uf}>
            {uf}
          </option>
        ))}
      </Select>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-navy-deep">
          Valor pedido mín. (R$)
        </label>
        <input
          type="number"
          name="valorMin"
          min={0}
          defaultValue={current.valorMin}
          className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-navy-light"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-navy-deep">
          Valor pedido máx. (R$)
        </label>
        <input
          type="number"
          name="valorMax"
          min={0}
          defaultValue={current.valorMax}
          className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-navy-light"
        />
      </div>

      <Select name="sort" label="Ordenar por" defaultValue={current.sort}>
        <option value="recentes">Mais recentes</option>
        <option value="menor_valor">Menor valor pedido</option>
        <option value="maior_valor">Maior valor pedido</option>
      </Select>

      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
        <button
          type="submit"
          className="w-full rounded-md bg-navy-deep px-4 py-2 text-sm font-semibold text-white hover:bg-navy"
        >
          Filtrar
        </button>
      </div>
    </form>
  );
}

function Select({
  name,
  label,
  defaultValue,
  children,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-navy-deep">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-navy-light"
      >
        {children}
      </select>
    </div>
  );
}
