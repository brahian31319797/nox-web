"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeftIcon } from "@/components/site/icons";
import { AlertIcon, CheckIcon, PlusIcon, UploadIcon } from "@/components/admin/icons";
import { actualizarProducto, crearProducto } from "@/lib/actions/productos";
import { centsToDecimalDisplay, digitsFromInput } from "@/lib/format";
import { slugify } from "@/lib/schemas";
import { subirImagenProducto } from "@/lib/upload";
import type { Categoria, Producto, Spec } from "@/lib/types";

export function ProductoForm({ categorias, producto }: { categorias: Categoria[]; producto?: Producto }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const esEdicion = Boolean(producto);

  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [slug, setSlug] = useState(producto?.slug ?? "");
  const [slugTocado, setSlugTocado] = useState(esEdicion);
  const [categoriaId, setCategoriaId] = useState(producto?.categoria_id ?? categorias[0]?.id ?? "");
  const [etiqueta, setEtiqueta] = useState(producto?.etiqueta ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [precioArsCents, setPrecioArsCents] = useState(() =>
    String(Math.round((producto?.precio_ars ?? 0) * 100))
  );
  const [precioUsdCents, setPrecioUsdCents] = useState(() =>
    String(Math.round((producto?.precio_usd ?? 0) * 100))
  );
  const [specs, setSpecs] = useState<Spec[]>(producto?.specs ?? [{ label: "", value: "" }]);
  const [imagenes, setImagenes] = useState<string[]>(producto?.imagenes ?? []);
  const [publicado, setPublicado] = useState(producto?.publicado ?? true);

  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onNombreChange(v: string) {
    setNombre(v);
    if (!slugTocado) setSlug(slugify(v));
  }

  async function onArchivos(files: FileList | null) {
    if (!files || files.length === 0) return;
    setSubiendo(true);
    setError(null);
    try {
      const urls = await Promise.all(Array.from(files).map(subirImagenProducto));
      setImagenes((prev) => [...prev, ...urls]);
    } catch {
      setError("No se pudo subir la foto. Probá de nuevo.");
    } finally {
      setSubiendo(false);
    }
  }

  function actualizarSpec(i: number, campo: "label" | "value", valor: string) {
    setSpecs((prev) => prev.map((s, idx) => (idx === i ? { ...s, [campo]: valor } : s)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);

    const payload = {
      nombre,
      slug,
      categoria_id: categoriaId,
      etiqueta: etiqueta.trim() || null,
      descripcion: descripcion.trim() || null,
      precio_ars: Number(precioArsCents) / 100,
      precio_usd: Number(precioUsdCents) / 100,
      specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      imagenes,
      publicado,
    };

    const res = esEdicion ? await actualizarProducto(producto!.id, payload) : await crearProducto(payload);

    if (!res.ok) {
      setError(res.error);
      setGuardando(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Link
        href="/admin/productos"
        className="mb-3.5 inline-flex items-center gap-1.5 font-mono text-xs text-[var(--ink-soft)] hover:text-[var(--accent-2)]"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Volver a productos
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[26px]">{esEdicion ? "Editar producto" : "Nuevo producto"}</h1>
        <div className="flex gap-2.5">
          <Link
            href="/admin/productos"
            className="rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-5 py-2.5 text-sm font-bold"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={guardando || subiendo}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-[var(--accent-ink)] disabled:opacity-60"
          >
            <CheckIcon className="h-4 w-4" />
            {guardando ? "Guardando…" : "Guardar producto"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2.5 rounded-[11px] border border-[rgba(255,93,108,.35)] bg-[var(--danger-soft)] p-3.5 text-[13px] text-[var(--danger)]">
          <AlertIcon className="h-4 w-4 flex-none" />
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-[.85fr_1.15fr] md:items-start">
        <div className="flex flex-col gap-[18px]">
          <Panel title="Fotos del producto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onArchivos(e.target.files)}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onArchivos(e.dataTransfer.files);
              }}
              className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[11px] border-[1.5px] border-dashed border-[var(--line-strong)] p-5 text-center text-[var(--ink-faint)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-2)]"
            >
              <UploadIcon className="h-7 w-7" />
              <div className="text-[13.5px] font-bold text-[var(--ink)]">
                {subiendo ? "Subiendo…" : "Arrastrá las fotos acá"}
              </div>
              <div className="text-[11.5px]">o hacé clic para elegir · JPG/PNG hasta 8MB</div>
            </div>
            {imagenes.length > 0 && (
              <div className="mt-3.5 grid grid-cols-4 gap-2">
                {imagenes.map((url, i) => (
                  <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-3)]">
                    <Image src={url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagenes((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-black/70 text-[11px] text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[13.5px] font-semibold">Publicado</div>
                <div className="mt-0.5 text-[11.5px] text-[var(--ink-faint)]">Visible en la web para los clientes</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={publicado}
                onClick={() => setPublicado((v) => !v)}
                className={`flex h-[26px] w-11 flex-none items-center rounded-full p-[3px] transition-colors ${
                  publicado ? "justify-end bg-[var(--ok-soft)]" : "justify-start bg-[var(--surface-3)]"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full transition-colors ${publicado ? "bg-[var(--ok)]" : "bg-[var(--ink-faint)]"}`}
                />
              </button>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-[18px]">
          <Panel title="Información general">
            <Field label="Nombre del producto">
              <input
                required
                value={nombre}
                onChange={(e) => onNombreChange(e.target.value)}
                placeholder="Ej: ZAROS L8 Max"
                className="h-full w-full bg-transparent text-[14.5px] outline-none placeholder:text-[var(--ink-faint)]"
              />
            </Field>
            <Field label="Slug (url)">
              <input
                required
                value={slug}
                onChange={(e) => {
                  setSlugTocado(true);
                  setSlug(e.target.value);
                }}
                placeholder="zaros-l8-max"
                className="h-full w-full bg-transparent font-mono text-[13.5px] outline-none placeholder:text-[var(--ink-faint)]"
              />
            </Field>

            <div className="mb-4">
              <label className="mb-1.5 block text-[12.5px] font-semibold text-[var(--ink-soft)]">Categoría</label>
              <div className="flex flex-wrap gap-2">
                {categorias.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategoriaId(c.id)}
                    className={`rounded-full border-[1.5px] px-4 py-2 text-[13px] font-semibold ${
                      categoriaId === c.id
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]"
                        : "border-[var(--line)] text-[var(--ink-soft)]"
                    }`}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Etiqueta destacada (opcional)">
              <input
                value={etiqueta}
                onChange={(e) => setEtiqueta(e.target.value)}
                placeholder="Ej: Más vendido, Premium…"
                className="h-full w-full bg-transparent text-[14.5px] outline-none placeholder:text-[var(--ink-faint)]"
              />
            </Field>

            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-[var(--ink-soft)]">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Contá qué lo hace especial…"
                rows={3}
                className="w-full rounded-[10px] border-[1.5px] border-[var(--line)] bg-[var(--surface-2)] p-3.5 text-[14px] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)]"
              />
            </div>
          </Panel>

          <Panel title="Precios">
            <div className="grid grid-cols-2 gap-3.5">
              <Field label="Precio en pesos" prefix="$">
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  value={centsToDecimalDisplay(precioArsCents)}
                  onChange={(e) => setPrecioArsCents(digitsFromInput(e.target.value))}
                  className="h-full w-full bg-transparent text-right text-[14.5px] tabular-nums outline-none"
                />
              </Field>
              <Field label="Precio en dólares" prefix="US$">
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  value={centsToDecimalDisplay(precioUsdCents)}
                  onChange={(e) => setPrecioUsdCents(digitsFromInput(e.target.value))}
                  className="h-full w-full bg-transparent text-right text-[14.5px] tabular-nums outline-none"
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Características técnicas">
            {specs.map((s, i) => (
              <div key={i} className="mb-2 grid grid-cols-[1fr_1fr_32px] gap-2">
                <input
                  value={s.label}
                  onChange={(e) => actualizarSpec(i, "label", e.target.value)}
                  placeholder="Ej: Potencia motor"
                  className="rounded-lg border-[1.5px] border-[var(--line)] bg-[var(--surface-2)] px-2.5 py-2 text-[13px] outline-none focus:border-[var(--accent)]"
                />
                <input
                  value={s.value}
                  onChange={(e) => actualizarSpec(i, "value", e.target.value)}
                  placeholder="Ej: 500W"
                  className="rounded-lg border-[1.5px] border-[var(--line)] bg-[var(--surface-2)] px-2.5 py-2 text-[13px] outline-none focus:border-[var(--accent)]"
                />
                <button
                  type="button"
                  onClick={() => setSpecs((prev) => prev.filter((_, idx) => idx !== i))}
                  className="grid place-items-center rounded-lg text-[var(--ink-faint)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSpecs((prev) => [...prev, { label: "", value: "" }])}
              className="mt-1 flex items-center gap-1.5 px-1 text-[13px] font-bold text-[var(--accent-2)]"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Agregar característica
            </button>
          </Panel>
        </div>
      </div>
    </form>
  );
}

function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-5">
      {title && <h4 className="mb-4 font-mono text-[13px] uppercase tracking-wider text-[var(--ink-faint)]">{title}</h4>}
      {children}
    </div>
  );
}

function Field({ label, prefix, children }: { label: string; prefix?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[12.5px] font-semibold text-[var(--ink-soft)]">{label}</label>
      <div className="flex h-[46px] items-center gap-2 rounded-[10px] border-[1.5px] border-[var(--line)] bg-[var(--surface-2)] px-3.5 focus-within:border-[var(--accent)]">
        {prefix && <span className="font-mono text-[13px] font-bold text-[var(--ink-faint)]">{prefix}</span>}
        {children}
      </div>
    </div>
  );
}
