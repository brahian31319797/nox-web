import Link from "next/link";
import { ArrowRightIcon } from "@/components/site/icons";

/**
 * Encabezado de sección.
 *
 * Antes cada sección arrancaba con la misma línea en mono mayúscula ("ELEGÍ TU
 * ESTILO", "LOS MÁS ELEGIDOS"...). Repetido siete veces era puro relleno y el
 * rasgo más reconocible de plantilla generada.
 *
 * Ahora numeramos: un índice como el de un manual técnico, apoyado en una
 * barra del color de marca. Da orden, no dice nada de más, y es el mismo
 * lenguaje de señalética del que sale el logo.
 */
export function SectionHeader({
  numero,
  titulo,
  bajada,
  accion,
}: {
  numero: string;
  titulo: string;
  bajada?: string;
  accion?: { href: string; label: string };
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="flex gap-4">
        <span
          aria-hidden
          className="mt-1.5 block h-[42px] w-[3px] flex-none bg-[var(--accent)] md:h-[54px]"
        />
        <div>
          <span className="block font-mono text-[12px] tracking-[0.1em] text-[var(--ink-faint)]">
            {numero}
          </span>
          <h2 className="mt-1 text-[clamp(26px,5.5vw,40px)]">{titulo}</h2>
          {bajada && (
            <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
              {bajada}
            </p>
          )}
        </div>
      </div>

      {accion && (
        <Link
          href={accion.href}
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-[var(--accent-2)] md:min-h-0"
        >
          {accion.label}
          <ArrowRightIcon className="h-[15px] w-[15px]" />
        </Link>
      )}
    </div>
  );
}
