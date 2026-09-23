import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/site/icons";

/**
 * El hero anterior ("La ciudad es tuya, movete eléctrico") le hablaba al ego.
 * Nuestro público compra cuando le cierra el número, no cuando se siente cool:
 * son trabajadores que quieren dejar de gastar en transporte. Por eso el
 * titular va al bolsillo y el segundo botón lleva directo a la calculadora.
 * Ver docs/manual-de-marca.md §1.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)]">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Persona circulando en un monopatín eléctrico por la ciudad"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "0% 77%" }}
        />
      </div>
      {/* Velo plano y parejo (sin degradado) para que el texto se lea siempre */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative mx-auto flex min-h-[clamp(480px,70vh,640px)] max-w-[1180px] items-center px-5 py-16">
        <div className="max-w-[640px]">
          <h1 className="text-[clamp(42px,7vw,76px)] text-[var(--ink)]">
            Dejá de pagar
            <br />
            por <em className="not-italic text-[var(--accent)]">moverte</em>.
          </h1>

          <p className="my-6 max-w-[46ch] text-[clamp(15.5px,1.7vw,19px)] leading-relaxed text-[var(--ink-soft)]">
            Lo que se te va todos los meses en nafta o colectivo puede terminar siendo tuyo.
            Monopatines, motos y bicis eléctricas, con envío a todo el país.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-[24px] py-[14px] text-[15px] font-bold text-[var(--accent-ink)] transition-transform hover:-translate-y-0.5"
            >
              Ver modelos
              <ArrowRightIcon className="h-[18px] w-[18px]" />
            </Link>
            <a
              href="#calculadora"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--money-line)] bg-[var(--money-soft)] px-[24px] py-[14px] text-[15px] font-bold text-[var(--money)] transition-transform hover:-translate-y-0.5"
            >
              Calculá cuánto ahorrás
            </a>
          </div>

          {/* Los tres diferenciales reales, sin adornos. Manual de marca §4.
              En mobile van apilados: los separadores quedaban colgando al final
              de cada renglón, así que solo aparecen cuando entran en una línea. */}
          <ul className="mt-8 flex flex-col gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-soft)] sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
            <li>Pagás 50% y el resto al recibir</li>
            <li aria-hidden className="hidden text-[var(--ink-faint)] sm:block">·</li>
            <li>Envío a todo el país</li>
            <li aria-hidden className="hidden text-[var(--ink-faint)] sm:block">·</li>
            <li>Te asesoro yo, no un bot</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
