"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { VehicleIcon, SearchIcon } from "@/components/site/icons";
import { PencilIcon, PlusIcon, TrashIcon, AlertIcon } from "@/components/admin/icons";
import { fmtArs, fmtUsd } from "@/lib/format";
import { eliminarProducto } from "@/lib/actions/productos";
import type { Categoria, Producto } from "@/lib/types";

export function ProductosTable({ productos, categorias }: { productos: Producto[]; categorias: Categoria[] }) {
  const [query, setQuery] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("all");
  const [borrarObjetivo, setBorrarObjetivo] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productos.filter((p) => {
      const catOk = categoriaActiva === "all" || p.categoria.slug === categoriaActiva;
      if (!catOk) return false;
      if (!q) return true;
      return (p.nombre + " " + p.categoria.nombre).toLowerCase().includes(q);
    });
  }, [productos, query, categoriaActiva]);

  function confirmarBorrado() {
    if (!borrarObjetivo) return;
    startTransition(async () => {
      const res = await eliminarProducto(borrarObjetivo.id);
      if (!res.ok) {
        setError(res.error);
      } else {
        setError(null);
      }
      setBorrarObjetivo(null);
    });
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px]">Productos</h1>
          <p className="mt-1 text-[13.5px] text-[var(--ink-soft)]">Gestioná el catálogo que ven tus clientes en la web.</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-[var(--accent-ink)]"
        >
          <PlusIcon className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2.5 rounded-[11px] border border-[rgba(255,93,108,.35)] bg-[var(--danger-soft)] p-3.5 text-[13px] text-[var(--danger)]">
          <AlertIcon className="h-4 w-4 flex-none" />
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="flex h-11 min-w-[220px] flex-1 items-center gap-2 rounded-[10px] border-[1.5px] border-[var(--line)] bg-[var(--surface)] px-3.5 focus-within:border-[var(--accent)]">
          <SearchIcon className="h-4 w-4 flex-none text-[var(--ink-faint)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--ink-faint)]"
          />
        </div>
        <Chip label="Todos" active={categoriaActiva === "all"} onClick={() => setCategoriaActiva("all")} />
        {categorias.map((c) => (
          <Chip key={c.slug} label={c.nombre} active={categoriaActiva === c.slug} onClick={() => setCategoriaActiva(c.slug)} />
        ))}
      </div>

      <div className="overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--surface)]">
        <div className="hidden grid-cols-[52px_2.1fr_1fr_1fr_.9fr_84px] gap-3.5 px-4 py-3 font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-faint)] md:grid">
          <span />
          <span>Producto</span>
          <span>Categoría</span>
          <span>Precio</span>
          <span>Estado</span>
          <span />
        </div>
        {filtrados.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-[40px_1fr_74px] items-center gap-3 border-t border-[var(--line)] px-4 py-3 hover:bg-[var(--surface-2)] md:grid-cols-[52px_2.1fr_1fr_1fr_.9fr_84px] md:gap-3.5 md:first:border-t-0"
          >
            <div className="grid h-11 w-11 place-items-center rounded-[9px] border border-[var(--line)] bg-[var(--surface-3)] overflow-hidden">
              {p.imagenes[0] ? (
                <Image src={p.imagenes[0]} alt={p.nombre} width={44} height={44} className="h-full w-full object-cover" />
              ) : (
                <VehicleIcon categoria={p.categoria.slug} className="w-[60%] text-[var(--ink-soft)]" />
              )}
            </div>
            <div>
              <div className="text-[14.5px] font-bold">{p.nombre}</div>
              <div className="mt-0.5 font-mono text-[10.5px] uppercase text-[var(--ink-faint)]">
                {p.etiqueta ? `${p.etiqueta} · ` : ""}
                {p.categoria.nombre}
              </div>
            </div>
            <div className="hidden font-mono text-[12.5px] text-[var(--ink-soft)] md:block">{p.categoria.nombre}</div>
            <div>
              <div className="font-mono text-[13.5px] font-bold tabular-nums">{fmtArs(p.precio_ars)}</div>
              <div className="mt-0.5 font-mono text-[11px] text-[var(--ink-faint)]">{fmtUsd(p.precio_usd)}</div>
            </div>
            <div className="hidden md:block">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
                  p.publicado ? "bg-[var(--ok-soft)] text-[var(--ok)]" : "bg-[var(--surface-3)] text-[var(--ink-faint)]"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${p.publicado ? "bg-[var(--ok)]" : "bg-[var(--ink-faint)]"}`} />
                {p.publicado ? "Publicado" : "Oculto"}
              </span>
            </div>
            <div className="flex justify-end gap-1">
              <Link
                href={`/admin/productos/${p.id}`}
                aria-label="Editar"
                className="grid h-8 w-8 place-items-center rounded-lg text-[var(--ink-soft)] hover:bg-[var(--surface-3)] hover:text-[var(--ink)]"
              >
                <PencilIcon className="h-4 w-4" />
              </Link>
              <button
                aria-label="Eliminar"
                onClick={() => setBorrarObjetivo(p)}
                className="grid h-8 w-8 place-items-center rounded-lg text-[var(--ink-soft)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtrados.length === 0 && (
        <div className="py-16 text-center text-[var(--ink-soft)]">
          <SearchIcon className="mx-auto mb-3.5 h-9 w-9 text-[var(--ink-faint)]" />
          <h3 className="mb-1.5 font-display text-lg font-bold">Sin resultados</h3>
          <p>No hay productos que coincidan con la búsqueda.</p>
        </div>
      )}

      {borrarObjetivo && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(6,6,7,.6)] p-5 backdrop-blur-[3px]">
          <div className="w-full max-w-[380px] rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6">
            <div className="mb-3.5 grid h-11 w-11 place-items-center rounded-xl bg-[var(--danger-soft)] text-[var(--danger)]">
              <TrashIcon className="h-[22px] w-[22px]" />
            </div>
            <h3 className="mb-2 text-lg">¿Eliminar este producto?</h3>
            <p className="mb-5 text-[13.5px] text-[var(--ink-soft)]">
              &ldquo;{borrarObjetivo.nombre}&rdquo; se va a quitar del catálogo y de la web. Esta acción no se puede
              deshacer.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setBorrarObjetivo(null)}
                className="flex-1 rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] py-2.5 text-sm font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarBorrado}
                disabled={pending}
                className="flex-1 rounded-[10px] bg-[var(--danger)] py-2.5 text-sm font-bold text-[#2b0509] disabled:opacity-60"
              >
                {pending ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border-[1.5px] px-4 py-2 text-[13px] font-semibold transition-colors ${
        active ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--canvas)]" : "border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--line-strong)]"
      }`}
    >
      {label}
    </button>
  );
}
