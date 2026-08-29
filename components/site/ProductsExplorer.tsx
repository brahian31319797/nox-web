"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { SearchIcon } from "@/components/site/icons";
import type { Categoria, Producto } from "@/lib/types";

export function ProductsExplorer({
  productos,
  categorias,
  categoriaInicial,
}: {
  productos: Producto[];
  categorias: Categoria[];
  categoriaInicial?: string;
}) {
  const [query, setQuery] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<string>(categoriaInicial ?? "all");

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productos.filter((p) => {
      const catOk = categoriaActiva === "all" || p.categoria.slug === categoriaActiva;
      if (!catOk) return false;
      if (!q) return true;
      const hay = [p.nombre, p.categoria.nombre, p.etiqueta ?? "", ...p.specs.map((s) => s.value)]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [productos, query, categoriaActiva]);

  const conteo = (slug: string) =>
    slug === "all" ? productos.length : productos.filter((p) => p.categoria.slug === slug).length;

  return (
    <>
      <div className="sticky top-16 z-20 -mx-5 border-b border-[var(--line)] bg-[var(--canvas)]/90 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex h-[52px] items-center gap-2.5 rounded-[13px] border-[1.5px] border-[var(--line)] bg-[var(--surface)] px-4 shadow-sm focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px_rgba(255,90,31,.18)]">
            <SearchIcon className="h-[19px] w-[19px] flex-none text-[var(--ink-faint)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar modelo, categoría, potencia…"
              className="w-full bg-transparent text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="px-1 text-xl text-[var(--ink-faint)]"
              >
                ×
              </button>
            )}
          </div>

          <div className="mt-3.5 flex flex-wrap gap-2">
            <FilterChip label="Todos" count={conteo("all")} active={categoriaActiva === "all"} onClick={() => setCategoriaActiva("all")} />
            {categorias.map((c) => (
              <FilterChip
                key={c.slug}
                label={c.nombre}
                count={conteo(c.slug)}
                active={categoriaActiva === c.slug}
                onClick={() => setCategoriaActiva(c.slug)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-5">
        <p className="my-5 font-mono text-xs text-[var(--ink-faint)]">
          {filtrados.length} {filtrados.length === 1 ? "producto" : "productos"}
          {categoriaActiva !== "all" && ` · ${categorias.find((c) => c.slug === categoriaActiva)?.nombre}`}
          {query && ` · "${query}"`}
        </p>

        {filtrados.length === 0 ? (
          <div className="py-16 text-center text-[var(--ink-soft)]">
            <SearchIcon className="mx-auto mb-3.5 h-11 w-11 text-[var(--ink-faint)]" />
            <h3 className="mb-1.5 font-display text-lg font-bold">Sin resultados</h3>
            <p>No encontramos productos para tu búsqueda. Probá con otra palabra.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-16 md:grid-cols-3 md:gap-[18px]">
            {filtrados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-4 py-2 text-[13.5px] font-semibold transition-colors ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]"
          : "border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
      }`}
    >
      {label}
      <span className={`font-mono text-[11px] ${active ? "text-[rgba(10,10,11,0.6)]" : "text-[var(--ink-faint)]"}`}>
        {count}
      </span>
    </button>
  );
}
