import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  BoltSpecIcon,
  CoinsIcon,
  InstagramIcon,
  VehicleIcon,
  WhatsAppIcon,
} from "@/components/site/icons";
import { fmtArs, fmtUsd } from "@/lib/format";
import { getProductoBySlug } from "@/lib/productos";
import { buildProductWhatsAppUrl, INSTAGRAM_URL } from "@/lib/whatsapp";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  return { title: producto ? `${producto.nombre} — Brahian González` : "Producto no encontrado" };
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) notFound();

  const tieneFotos = producto.imagenes.length > 0;

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-16 pt-8">
      <Link
        href="/productos"
        className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-[var(--ink-soft)] hover:text-[var(--accent-2)]"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Volver al catálogo
      </Link>

      <div className="grid gap-9 md:grid-cols-2">
        <div>
          <div className="relative grid aspect-[4/3.2] place-items-center overflow-hidden rounded-[26px] border border-[var(--line)] bg-[radial-gradient(120%_100%_at_50%_10%,var(--surface-3),var(--surface-2))]">
            <span className="absolute left-4 top-4 rounded-full bg-[var(--accent)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--accent-ink)]">
              {producto.etiqueta ?? producto.categoria.nombre}
            </span>
            {tieneFotos ? (
              <Image src={producto.imagenes[0]} alt={producto.nombre} fill className="object-cover" />
            ) : (
              <VehicleIcon categoria={producto.categoria.slug} className="w-[76%] text-[var(--ink)]" />
            )}
          </div>
        </div>

        <div>
          <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--accent-2)]">
            {producto.categoria.nombre}
          </span>
          <h1 className="mb-2 mt-2.5 text-[clamp(28px,4vw,44px)]">{producto.nombre}</h1>
          {producto.descripcion && (
            <p className="mb-6 max-w-[46ch] text-[15.5px] text-[var(--ink-soft)]">{producto.descripcion}</p>
          )}

          <div className="mb-[22px] rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-5">
            <div className="font-display text-[clamp(30px,5vw,40px)] font-extrabold leading-none tabular-nums">
              {fmtArs(producto.precio_ars)}
            </div>
            <div className="mt-2 font-mono text-sm text-[var(--ink-soft)]">
              ≈ {fmtUsd(producto.precio_usd)} · precio de referencia
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[12.5px] text-[var(--ink-faint)]">
              <CoinsIcon className="h-3.5 w-3.5 text-[var(--accent)]" />
              Reservás con el 50% y pagás el resto al recibir
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2.5">
            <a
              href={buildProductWhatsAppUrl(producto)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-[22px] py-[13px] text-[15px] font-bold text-[var(--accent-ink)]"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              Consultar por WhatsApp
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--line)] bg-[var(--surface)] px-[22px] py-[13px] text-[15px] font-bold text-[var(--ink)]"
            >
              <InstagramIcon className="h-[18px] w-[18px]" />
              Ver Instagram
            </a>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-[var(--line)]">
            {producto.specs.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center justify-between gap-4 px-[18px] py-3.5 text-sm ${
                  i !== producto.specs.length - 1 ? "border-b border-[var(--line)]" : ""
                } ${i % 2 === 0 ? "bg-[var(--surface)]" : ""}`}
              >
                <span className="flex items-center gap-2.5 text-[var(--ink-soft)]">
                  <BoltSpecIcon className="h-[15px] w-[15px] text-[var(--accent)]" />
                  {s.label}
                </span>
                <span className="font-mono font-bold tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
