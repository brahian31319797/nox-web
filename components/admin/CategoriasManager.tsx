"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { VehicleIcon } from "@/components/site/icons";
import { AlertIcon, CheckIcon, TrashIcon, UploadIcon } from "@/components/admin/icons";
import { actualizarCategoria } from "@/lib/actions/categorias";
import { ArchivoInvalido, subirImagenCategoria } from "@/lib/upload";
import type { Categoria } from "@/lib/types";

/**
 * Gestión de las portadas de categoría.
 *
 * La pantalla anterior era de solo lectura: mostraba tres tarjetas y terminaba
 * pidiendo que le avisaran al desarrollador. Ahora Brahian sube, reemplaza y
 * borra las fotos él mismo.
 *
 * No hay alta ni baja de categorías a propósito: son tres fijas, cada una con
 * su ícono y su ruta en la web. Un botón de "nueva categoría" que después
 * rompe la portada sería peor que no tenerlo.
 */
export function CategoriasManager({
  categorias,
  conteos,
}: {
  categorias: Categoria[];
  conteos: Record<string, number>;
}) {
  const [lista, setLista] = useState(categorias);
  const [previas, setPrevias] = useState(categorias);
  const [error, setError] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState<string | null>(null);
  const [guardado, setGuardado] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (categorias !== previas) {
    setPrevias(categorias);
    setLista(categorias);
  }

  function aplicar(id: string, imagen: string | null) {
    const anterior = lista;
    setLista((a) => a.map((c) => (c.id === id ? { ...c, imagen } : c)));
    setError(null);
    startTransition(async () => {
      const res = await actualizarCategoria(id, { imagen });
      if (!res.ok) {
        setLista(anterior);
        setError(res.error);
        return;
      }
      setGuardado(id);
      setTimeout(() => setGuardado(null), 2200);
    });
  }

  async function elegirArchivo(id: string, file: File | undefined) {
    if (!file) return;
    setError(null);
    setSubiendo(id);
    try {
      const url = await subirImagenCategoria(file);
      aplicar(id, url);
    } catch (e) {
      setError(e instanceof ArchivoInvalido ? e.message : "No se pudo subir la imagen. Probá de nuevo.");
    } finally {
      setSubiendo(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[26px]">Categorías</h1>
        <p className="mt-1 max-w-[62ch] text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
          La foto de cada categoría es lo primero que se ve en la portada. Si no cargás ninguna, se
          muestra el dibujo del vehículo.
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2.5 rounded-[11px] border border-[rgba(255,122,144,.35)] bg-[var(--danger-soft)] p-3.5 text-[13px] text-[var(--danger)]">
          <AlertIcon className="h-4 w-4 flex-none" />
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {lista.map((c) => (
          <Tarjeta
            key={c.id}
            categoria={c}
            cantidad={conteos[c.slug] ?? 0}
            subiendo={subiendo === c.id}
            guardado={guardado === c.id}
            deshabilitado={pending || subiendo !== null}
            onArchivo={(f) => elegirArchivo(c.id, f)}
            onQuitar={() => aplicar(c.id, null)}
          />
        ))}
      </div>
    </div>
  );
}

function Tarjeta({
  categoria,
  cantidad,
  subiendo,
  guardado,
  deshabilitado,
  onArchivo,
  onQuitar,
}: {
  categoria: Categoria;
  cantidad: number;
  subiendo: boolean;
  guardado: boolean;
  deshabilitado: boolean;
  onArchivo: (f: File | undefined) => void;
  onQuitar: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--surface)]">
      <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-[var(--surface-3)]">
        {categoria.imagen ? (
          <Image
            src={categoria.imagen}
            alt={categoria.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <VehicleIcon categoria={categoria.slug} className="w-[52%] text-[var(--ink-faint)]" />
        )}

        {subiendo && (
          <div className="absolute inset-0 grid place-items-center bg-[rgba(10,10,11,.72)] font-mono text-[12px] text-[var(--ink)]">
            Subiendo…
          </div>
        )}
        {guardado && !subiendo && (
          <span className="absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-[var(--money-soft)] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide text-[var(--money)]">
            <CheckIcon className="h-3 w-3" />
            Guardada
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-[17px]">{categoria.nombre}</h3>
        <div className="mt-0.5 font-mono text-[11.5px] text-[var(--ink-faint)]">
          {cantidad} {cantidad === 1 ? "producto" : "productos"}
        </div>

        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            onArchivo(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={deshabilitado}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-[10px] border border-[var(--line-strong)] px-3 text-[13px] font-bold text-[var(--ink)] transition-colors hover:border-[var(--ink-faint)] disabled:opacity-50 md:min-h-[38px]"
          >
            <UploadIcon className="h-4 w-4" />
            {categoria.imagen ? "Cambiar" : "Subir foto"}
          </button>

          {categoria.imagen && (
            <button
              type="button"
              onClick={onQuitar}
              disabled={deshabilitado}
              aria-label={`Quitar la foto de ${categoria.nombre}`}
              className="grid min-h-[44px] w-11 place-items-center rounded-[10px] border border-[var(--line)] text-[var(--ink-faint)] transition-colors hover:border-[var(--danger)] hover:text-[var(--danger)] disabled:opacity-50 md:min-h-[38px]"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        <Link
          href={`/admin/productos?categoria=${categoria.slug}`}
          className="mt-3 block text-center font-mono text-[11.5px] text-[var(--ink-faint)] hover:text-[var(--accent-2)]"
        >
          Ver sus productos →
        </Link>
      </div>
    </div>
  );
}
