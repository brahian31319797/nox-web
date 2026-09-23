"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { VehicleIcon, SearchIcon } from "@/components/site/icons";
import {
  AlertIcon,
  CopyIcon,
  DragIcon,
  PencilIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from "@/components/admin/icons";
import { fmtArs, fmtUsd } from "@/lib/format";
import {
  alternarDestacado,
  alternarPublicado,
  duplicarProducto,
  eliminarProducto,
  reordenarProductos,
} from "@/lib/actions/productos";
import type { Categoria, Producto } from "@/lib/types";

const COLUMNAS = "grid-cols-[28px_44px_1fr_84px] md:grid-cols-[28px_48px_2fr_1fr_1fr_112px]";

export function ProductosTable({ productos, categorias }: { productos: Producto[]; categorias: Categoria[] }) {
  const [lista, setLista] = useState(productos);
  const [productosPrevios, setProductosPrevios] = useState(productos);
  const [query, setQuery] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("all");
  const [borrarObjetivo, setBorrarObjetivo] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // El server component vuelve a renderizar después de cada revalidate y trae
  // la lista fresca. Ajustamos el estado durante el render en lugar de en un
  // efecto: así no queda un frame intermedio mostrando el orden viejo.
  if (productos !== productosPrevios) {
    setProductosPrevios(productos);
    setLista(productos);
  }

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lista.filter((p) => {
      const catOk = categoriaActiva === "all" || p.categoria.slug === categoriaActiva;
      if (!catOk) return false;
      if (!q) return true;
      return (p.nombre + " " + p.categoria.nombre).toLowerCase().includes(q);
    });
  }, [lista, query, categoriaActiva]);

  // Arrastrar con la lista filtrada reordenaría de forma imprevisible: lo que
  // ves no sería todo lo que se está moviendo.
  const filtroActivo = query.trim() !== "" || categoriaActiva !== "all";
  const puedeOrdenar = !filtroActivo;

  const destacadosCount = lista.filter((p) => p.destacado && p.publicado).length;

  /** Aplica el cambio en pantalla y lo manda al servidor; si falla, revierte. */
  function optimista(id: string, cambio: Partial<Producto>, accion: () => Promise<{ ok: boolean; error?: string }>) {
    const previo = lista;
    setLista((actual) => actual.map((p) => (p.id === id ? { ...p, ...cambio } : p)));
    setError(null);
    startTransition(async () => {
      const res = await accion();
      if (!res.ok) {
        setLista(previo);
        setError(res.error ?? "No se pudo guardar el cambio.");
      }
    });
  }

  function soltar(destinoId: string) {
    if (!arrastrando || arrastrando === destinoId) return setArrastrando(null);

    const desde = lista.findIndex((p) => p.id === arrastrando);
    const hasta = lista.findIndex((p) => p.id === destinoId);
    if (desde < 0 || hasta < 0) return setArrastrando(null);

    const nueva = [...lista];
    const [movido] = nueva.splice(desde, 1);
    nueva.splice(hasta, 0, movido);

    const previo = lista;
    setLista(nueva);
    setArrastrando(null);
    setError(null);
    startTransition(async () => {
      const res = await reordenarProductos(nueva.map((p) => p.id));
      if (!res.ok) {
        setLista(previo);
        setError(res.error);
      }
    });
  }

  function confirmarBorrado() {
    if (!borrarObjetivo) return;
    startTransition(async () => {
      const res = await eliminarProducto(borrarObjetivo.id);
      setError(res.ok ? null : res.error);
      setBorrarObjetivo(null);
    });
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px]">Productos</h1>
          <p className="mt-1 text-[13.5px] text-[var(--ink-soft)]">
            {destacadosCount > 0
              ? `${lista.length} en el catálogo · ${destacadosCount} en la portada`
              : `${lista.length} en el catálogo`}
          </p>
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

      <p className="mb-3 text-[12.5px] text-[var(--ink-faint)]">
        {puedeOrdenar
          ? "Arrastrá desde los puntitos para cambiar el orden en que se ven en la web. La estrella elige los de la portada."
          : "Para reordenar, limpiá la búsqueda y el filtro de categoría."}
      </p>

      <div className="overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--surface)]">
        <div className={`hidden ${COLUMNAS} gap-3.5 px-4 py-3 font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-faint)] md:grid`}>
          <span />
          <span />
          <span>Producto</span>
          <span>Precio</span>
          <span>Entrega</span>
          <span />
        </div>

        {filtrados.map((p) => (
          <div
            key={p.id}
            draggable={puedeOrdenar}
            onDragStart={() => setArrastrando(p.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => soltar(p.id)}
            onDragEnd={() => setArrastrando(null)}
            className={`grid ${COLUMNAS} items-center gap-3 border-t border-[var(--line)] px-4 py-3 md:gap-3.5 md:first:border-t-0 ${
              arrastrando === p.id ? "opacity-40" : "hover:bg-[var(--surface-2)]"
            } ${!p.publicado ? "opacity-70" : ""}`}
          >
            <span
              aria-hidden
              className={`text-[var(--ink-faint)] ${puedeOrdenar ? "cursor-grab active:cursor-grabbing" : "opacity-30"}`}
            >
              <DragIcon className="h-4 w-4" />
            </span>

            <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-[9px] border border-[var(--line)] bg-[var(--surface-3)]">
              {p.imagenes[0] ? (
                <Image src={p.imagenes[0]} alt={p.nombre} width={44} height={44} className="h-full w-full object-cover" />
              ) : (
                <VehicleIcon categoria={p.categoria.slug} className="w-[60%] text-[var(--ink-soft)]" />
              )}
            </div>

            <div className="min-w-0">
              <div className="truncate text-[14.5px] font-bold">{p.nombre}</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-[10.5px] uppercase text-[var(--ink-faint)]">
                <span>{p.categoria.nombre}</span>
                {!p.publicado && <span className="text-[var(--ink-faint)]">· Oculto</span>}
                {p.imagenes.length === 0 && <span className="text-[var(--danger)]">· Sin foto</span>}
              </div>
            </div>

            <div className="hidden md:block">
              <div className="font-mono text-[13.5px] font-bold tabular-nums">{fmtArs(p.precio_ars)}</div>
              <div className="mt-0.5 font-mono text-[11px] text-[var(--ink-faint)]">{fmtUsd(p.precio_usd)}</div>
            </div>

            <div className="hidden font-mono text-[12px] text-[var(--ink-soft)] md:block">
              {p.entrega?.trim() || <span className="text-[var(--ink-faint)]">—</span>}
            </div>

            <div className="flex justify-end gap-0.5">
              <IconButton
                label={p.destacado ? "Sacar de la portada" : "Poner en la portada"}
                onClick={() => optimista(p.id, { destacado: !p.destacado }, () => alternarDestacado(p.id, !p.destacado))}
                disabled={pending}
                className={p.destacado ? "text-[var(--accent-2)]" : "text-[var(--ink-faint)] hover:text-[var(--accent-2)]"}
              >
                <StarIcon filled={p.destacado} className="h-[17px] w-[17px]" />
              </IconButton>

              <IconButton
                label={p.publicado ? "Ocultar de la web" : "Publicar en la web"}
                onClick={() => optimista(p.id, { publicado: !p.publicado }, () => alternarPublicado(p.id, !p.publicado))}
                disabled={pending}
                className={p.publicado ? "text-[var(--ok)]" : "text-[var(--ink-faint)]"}
              >
                <span className={`block h-2.5 w-2.5 rounded-full ${p.publicado ? "bg-[var(--ok)]" : "border-[1.5px] border-current"}`} />
              </IconButton>

              <IconButton
                label="Duplicar"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const res = await duplicarProducto(p.id);
                    setError(res.ok ? null : res.error);
                  })
                }
              >
                <CopyIcon className="h-4 w-4" />
              </IconButton>

              <Link
                href={`/admin/productos/${p.id}`}
                aria-label={`Editar ${p.nombre}`}
                className="grid h-8 w-8 place-items-center rounded-lg text-[var(--ink-soft)] hover:bg-[var(--surface-3)] hover:text-[var(--ink)]"
              >
                <PencilIcon className="h-4 w-4" />
              </Link>

              <IconButton
                label={`Eliminar ${p.nombre}`}
                onClick={() => setBorrarObjetivo(p)}
                className="hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
              >
                <TrashIcon className="h-4 w-4" />
              </IconButton>
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

function IconButton({
  label,
  onClick,
  disabled,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-8 w-8 place-items-center rounded-lg text-[var(--ink-soft)] transition-colors hover:bg-[var(--surface-3)] disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
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
