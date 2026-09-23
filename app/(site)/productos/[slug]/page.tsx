import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, BoltSpecIcon, CoinsIcon, InstagramIcon, WhatsAppIcon, TruckIcon } from "@/components/site/icons";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ProductoJsonLd } from "@/components/site/DatosEstructurados";
import { fmtArs, fmtUsd } from "@/lib/format";
import { getProductoBySlug } from "@/lib/productos";
import { buildProductWhatsAppUrl, INSTAGRAM_URL } from "@/lib/whatsapp";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) return { title: "Producto no encontrado" };

  const descripcion =
    producto.descripcion?.trim() ||
    `${producto.nombre} — ${producto.categoria.nombre}. Envío a todo el país y opciones de financiación.`;

  return {
    title: producto.nombre,
    description: descripcion,
    alternates: { canonical: `/productos/${producto.slug}` },
    openGraph: {
      type: "website",
      title: producto.nombre,
      description: descripcion,
      url: `/productos/${producto.slug}`,
    },
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) notFound();

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-16 pt-8">
      <ProductoJsonLd producto={producto} />
      <Link
        href="/productos"
        className="-ml-2 mb-4 inline-flex min-h-[44px] items-center gap-1.5 px-2 font-mono text-xs text-[var(--ink-soft)] hover:text-[var(--accent-2)] md:mb-6 md:min-h-0 md:px-0"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Volver al catálogo
      </Link>

      <div className="grid gap-9 md:grid-cols-2 md:items-start">
        <div>
          <ProductGallery
            imagenes={producto.imagenes}
            nombre={producto.nombre}
            categoria={producto.categoria}
            etiqueta={producto.etiqueta}
          />

          {/* En escritorio la descripción vive acá, debajo de las fotos: deja
              la columna derecha para lo que decide la compra (precio, contacto
              y ficha técnica). En celular hay una sola columna, así que va
              pegada al título, que es su lugar natural al leer de corrido. */}
          {producto.descripcion && (
            <div className="mt-7 hidden md:block">
              <h2 className="text-[17px]">Sobre este modelo</h2>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                {producto.descripcion}
              </p>
            </div>
          )}
        </div>

        <div>
          <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--accent-2)]">
            {producto.categoria.nombre}
          </span>
          <h1 className="mb-2 mt-2.5 text-[clamp(28px,4vw,44px)]">{producto.nombre}</h1>
          {producto.descripcion && (
            <p className="mb-6 text-[15.5px] leading-relaxed text-[var(--ink-soft)] md:hidden">
              {producto.descripcion}
            </p>
          )}

          {/* Las dos monedas con el mismo peso visual: se vende en pesos y en
              dólares por igual, así que ninguna es "de referencia". En celular
              se apilan porque con decimales los números no entran al lado. */}
          <div className="mb-[22px] overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--surface)]">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-[1.35] p-5 sm:border-r sm:border-[var(--line)]">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                  Pesos
                </div>
                <div className="mt-2 font-display text-[clamp(26px,4.4vw,34px)] font-black leading-none tracking-[-0.03em] tabular-nums">
                  {fmtArs(producto.precio_ars)}
                </div>
              </div>

              {producto.precio_usd > 0 && (
                <div className="flex-1 border-t border-[var(--line)] p-5 sm:border-t-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                    Dólares
                  </div>
                  <div className="mt-2 font-display text-[clamp(26px,4.4vw,34px)] font-black leading-none tracking-[-0.03em] tabular-nums text-[var(--ink-soft)]">
                    {fmtUsd(producto.precio_usd)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-[var(--line)] bg-[var(--canvas)] px-5 py-3.5">
              {/* Verde porque es plata a favor del cliente. Manual de marca §7.2 */}
              <span className="flex items-center gap-2 text-[13.5px] font-semibold text-[var(--money)]">
                <CoinsIcon className="h-4 w-4 flex-none" />
                Financiación disponible
              </span>
              {producto.entrega?.trim() && (
                <span className="flex items-center gap-2 font-mono text-[12.5px] text-[var(--ink-soft)]">
                  <TruckIcon className="h-4 w-4 flex-none text-[var(--ink-faint)]" />
                  Entrega {producto.entrega}
                </span>
              )}
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
                /* Rayado sin líneas divisorias: tenerlas a la vez era ruido.
                   Alterna el negro del fondo con un gris, no dos grises casi
                   iguales: con poca diferencia se leen como filas pegadas. */
                className={`flex items-center justify-between gap-4 px-[18px] py-3.5 text-sm ${
                  i % 2 === 0 ? "bg-[var(--canvas)]" : "bg-[var(--surface-2)]"
                }`}
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
