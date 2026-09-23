import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { SectionHeader } from "@/components/site/SectionHeader";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ProductCard } from "@/components/site/ProductCard";
import { SavingsCalculator } from "@/components/site/SavingsCalculator";
import { WhatsAppIcon } from "@/components/site/icons";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { elegirDestacados, getCategorias, getProductosPublicados } from "@/lib/productos";

/**
 * ORDEN DE FONDOS — alterna negro y gris, sin repetir nunca dos seguidos.
 * El footer es negro y cierra la secuencia, así que la última sección de acá
 * tiene que ser gris. Si agregás o movés una sección, recorré la lista entera
 * y reasigná: basta con insertar una en el medio para romper toda la cadena.
 *
 *   Hero         negro   (canvas)
 *   Datos        gris    (surface)
 *   Categorías   negro
 *   Destacados   gris
 *   Calculadora  negro   (la sección la pinta SavingsCalculator)
 *   Cierre       gris
 *   Footer       negro
 */
export default async function HomePage() {
  const [categorias, productos] = await Promise.all([getCategorias(), getProductosPublicados()]);
  const destacados = elegirDestacados(productos);
  const hayCatalogo = productos.length > 0;

  return (
    <main>
      <Hero />
      <TrustBar />

      {categorias.length > 0 && (
        <section className="px-5 py-14 md:py-16">
          <div className="mx-auto max-w-[1180px]">
            <SectionHeader
              numero="01"
              titulo="Elegí cómo te movés"
              accion={{ href: "/productos", label: "Ver todo" }}
            />
            <div className="grid gap-4 md:grid-cols-3">
              {categorias.map((c) => (
                <CategoryCard
                  key={c.slug}
                  categoria={c}
                  count={productos.filter((p) => p.categoria.slug === c.slug).length}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {hayCatalogo ? (
        <section className="bg-[var(--surface)] px-5 py-14 md:py-16">
          <div className="mx-auto max-w-[1180px]">
            <SectionHeader
              numero="02"
              titulo="Los más elegidos"
              accion={{ href: "/productos", label: "Ver catálogo" }}
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-[18px]">
              {destacados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Si la base no responde preferimos decirlo antes que inventar catálogo.
           Ver lib/productos.ts */
        <section className="px-5 py-14">
          <div className="mx-auto max-w-[640px] rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
            <h2 className="text-[22px]">Estamos actualizando el catálogo</h2>
            <p className="mx-auto mt-3 max-w-[44ch] text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
              Escribime por WhatsApp y te paso los modelos que tengo disponibles ahora mismo.
            </p>
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-[22px] py-[13px] text-[15px] font-bold text-[var(--accent-ink)]"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              Escribirme por WhatsApp
            </a>
          </div>
        </section>
      )}

      {hayCatalogo && <SavingsCalculator productos={productos} />}

      {/* Cierre: en lugar del bloque de color centrado de siempre, una franja
          partida con la firma del logo a un lado. */}
      <section className="bg-[var(--surface)] px-5 py-14 md:py-16">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-7 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="flex gap-4">
            <span aria-hidden className="block w-[3px] flex-none bg-[var(--accent)]" />
            <div>
              <h2 className="text-[clamp(26px,5.5vw,38px)]">¿No sabés cuál te sirve?</h2>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-[var(--ink-soft)]">
                Contame cuántos kilómetros hacés por día y te digo cuál te conviene de verdad.
              </p>
            </div>
          </div>
          <a
            href={buildGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-none items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 py-[15px] text-[15px] font-bold text-[var(--accent-ink)] transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            Escribirme por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
