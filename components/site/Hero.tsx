import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/site/icons";

/**
 * Dos composiciones distintas, no la misma achicada:
 *
 * - Escritorio: la foto va de fondo con el texto encima, que es donde una
 *   imagen apaisada rinde.
 * - Celular: la foto baja a su propio bloque con la proporción original. De
 *   fondo había que recortarla tanto que quedaba pared y piso, sin monopatín,
 *   y encima el texto peleaba con la imagen por el contraste.
 *
 * El segundo botón es de contorno, no verde sólido: dos superficies saturadas
 * una al lado de la otra se anulan, y el verde queda reservado para el dato de
 * plata (ver docs/manual-de-marca.md §7.2).
 */
export function Hero() {
  return (
    <section className="relative border-b border-[var(--line)]">
      {/* Fondo: solo desde md, donde la foto apaisada entra sin destrozarse */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "42% 72%" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(10,10,11,.94)_0%,rgba(10,10,11,.86)_42%,rgba(10,10,11,.45)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-5 pb-10 pt-12 md:flex md:min-h-[clamp(480px,68vh,620px)] md:items-center md:py-16">
        <div className="md:max-w-[620px]">
          <h1 className="text-[clamp(40px,10vw,76px)] text-[var(--ink)]">
            Dejá de pagar
            <br />
            por <em className="not-italic text-[var(--accent)]">moverte</em>.
          </h1>

          <p className="my-5 max-w-[42ch] text-[clamp(15.5px,4vw,19px)] leading-relaxed text-[var(--ink-soft)] md:my-6">
            Lo que se te va todos los meses en nafta o colectivo puede terminar siendo tuyo.
            Monopatines, motos y bicis eléctricas, con envío a todo el país.
          </p>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link
              href="/productos"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-[15px] text-[15px] font-bold text-[var(--accent-ink)] transition-transform hover:-translate-y-0.5"
            >
              Ver modelos
              <ArrowRightIcon className="h-[18px] w-[18px]" />
            </Link>
            <a
              href="#calculadora"
              className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[var(--line-strong)] px-6 py-[15px] text-[15px] font-bold text-[var(--ink)] transition-colors hover:border-[var(--ink-soft)]"
            >
              Calculá cuánto ahorrás
            </a>
          </div>
        </div>
      </div>

      {/* En celular la foto es un bloque propio: se ve el producto completo */}
      <div className="relative aspect-[16/9] w-full md:hidden">
        <Image
          src="/images/hero.jpg"
          alt="Monopatín eléctrico estacionado en la vereda"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 70%" }}
        />
      </div>
    </section>
  );
}
