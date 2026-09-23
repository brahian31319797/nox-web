import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/site/icons";

const TITULO = (
  <>
    Dejá de pagar
    <br />
    por <em className="not-italic text-[var(--accent)]">moverte</em>.
  </>
);

const BAJADA =
  "Lo que se te va todos los meses en nafta o colectivo puede terminar siendo tuyo. Monopatines, motos y bicis eléctricas, con envío a todo el país.";

/**
 * Dos composiciones, porque la foto es apaisada y no hay recorte vertical que
 * la salve:
 *
 * - Celular: la foto ocupa arriba y se funde hacia abajo, con el título
 *   apoyado sobre ese degradado. Antes eran dos bloques separados por un corte
 *   duro, y se veían pegados en vez de ser una sola pieza.
 * - Escritorio: la foto va de fondo con el texto encima, que es donde una
 *   imagen así rinde.
 *
 * Los botones van en fila y comparten el ancho: apilados y a ancho completo
 * pesaban más que el título y desbalanceaban todo.
 */
export function Hero() {
  return (
    <section className="border-b border-[var(--line)]">
      {/* ── Celular ─────────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="relative">
          <div className="relative aspect-square w-full">
            <Image
              src="/images/hero.jpg"
              alt="Monopatín eléctrico en la vereda"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "58% 62%" }}
            />
            {/* Se funde con el fondo: sin corte visible entre foto y texto */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(10,10,11,.18)_45%,rgba(10,10,11,.72)_72%,rgba(10,10,11,.96)_90%,var(--canvas)_100%)]" />
          </div>

          <h1 className="absolute inset-x-0 bottom-0 px-5 text-[clamp(38px,10.5vw,52px)]">
            {TITULO}
          </h1>
        </div>

        <div className="px-5 pb-11 pt-5">
          <p className="max-w-[44ch] text-[15.5px] leading-relaxed text-[var(--ink-soft)]">
            {BAJADA}
          </p>
          <div className="mt-6 flex gap-2.5">
            <Link
              href="/productos"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-[14px] text-[14.5px] font-bold text-[var(--accent-ink)]"
            >
              Ver modelos
              <ArrowRightIcon className="h-[17px] w-[17px]" />
            </Link>
            <a
              href="#calculadora"
              className="inline-flex flex-1 items-center justify-center rounded-full border-[1.5px] border-[var(--line-strong)] px-4 py-[14px] text-[14.5px] font-bold text-[var(--ink)]"
            >
              Calcular ahorro
            </a>
          </div>
        </div>
      </div>

      {/* ── Escritorio ──────────────────────────────────────────── */}
      <div className="relative hidden md:block">
        <div className="absolute inset-0">
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

        <div className="relative mx-auto flex min-h-[clamp(480px,68vh,620px)] max-w-[1180px] items-center px-5 py-16">
          <div className="max-w-[620px]">
            <h1 className="text-[clamp(52px,6.4vw,76px)]">{TITULO}</h1>
            <p className="my-6 max-w-[44ch] text-[19px] leading-relaxed text-[var(--ink-soft)]">
              {BAJADA}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-[15px] text-[15px] font-bold text-[var(--accent-ink)] transition-transform hover:-translate-y-0.5"
              >
                Ver modelos
                <ArrowRightIcon className="h-[18px] w-[18px]" />
              </Link>
              <a
                href="#calculadora"
                className="inline-flex items-center justify-center rounded-full border-[1.5px] border-[var(--line-strong)] px-6 py-[15px] text-[15px] font-bold text-[var(--ink)] transition-colors hover:border-[var(--ink-soft)]"
              >
                Calculá cuánto ahorrás
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
