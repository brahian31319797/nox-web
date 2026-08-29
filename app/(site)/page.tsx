import Link from "next/link";
import { Hero } from "@/components/site/Hero";
import { Benefits } from "@/components/site/Benefits";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ProductCard } from "@/components/site/ProductCard";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/site/icons";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { getCategorias, getProductosPublicados } from "@/lib/productos";

export default async function HomePage() {
  const [categorias, productos] = await Promise.all([getCategorias(), getProductosPublicados()]);
  const destacados = productos.slice(0, 3);

  return (
    <main>
      <Hero />

      <section className="border-y border-[var(--line)] bg-[var(--surface)] px-5 py-14">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
                Elegí tu estilo
              </span>
              <h2 className="text-[clamp(26px,3.6vw,40px)]">Categorías</h2>
            </div>
            <Link href="/productos" className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent-2)]">
              Ver todo <ArrowRightIcon className="h-[15px] w-[15px]" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {categorias.map((c) => (
              <CategoryCard key={c.slug} categoria={c} count={productos.filter((p) => p.categoria.slug === c.slug).length} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
                Los más elegidos
              </span>
              <h2 className="text-[clamp(26px,3.6vw,40px)]">Destacados</h2>
            </div>
            <Link href="/productos" className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent-2)]">
              Ver catálogo <ArrowRightIcon className="h-[15px] w-[15px]" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-[18px]">
            {destacados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </div>
      </section>

      <Benefits />

      <section className="px-5 py-14">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[26px] bg-[var(--accent)] px-6 py-12 text-center text-[var(--accent-ink)] md:px-11">
          <h2 className="text-[clamp(26px,4vw,40px)]">¿Dudas con qué modelo elegir?</h2>
          <p className="mx-auto my-3.5 max-w-[44ch] text-[rgba(10,10,11,0.75)]">
            Escribinos por WhatsApp y te ayudamos a encontrar el que va con vos.
          </p>
          <a
            href={buildGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-[22px] py-[13px] text-[15px] font-bold text-[var(--canvas)]"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            Escribir por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
