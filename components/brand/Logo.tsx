/**
 * Identidad de Brahian González — ver docs/manual-de-marca.md
 *
 * Monograma BG con franjas diagonales que sugieren movimiento. Las franjas son
 * el elemento que más rápido se reconoce, por eso son lo único que sobrevive en
 * la versión reducida del favicon (app/icon.svg): a 16px las dos letras se
 * empastan.
 */

/** Isotipo: el monograma solo. Para header, panel admin y contextos chicos. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Brahian González">
      <rect width="64" height="64" rx="15" fill="#151517" />
      <rect x="0.6" y="0.6" width="62.8" height="62.8" rx="14.4" fill="none" stroke="#2f2f34" strokeWidth="1.2" />
      <text
        x="27"
        y="34"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display)"
        fontWeight={900}
        fontSize={25}
        letterSpacing={-1.2}
        fill="#f5f4f1"
      >
        BG
      </text>
      <path d="M48 13 L56 13 L44 51 L36 51 Z" fill="#ff5a1f" />
      <path d="M58 24 L63 24 L55 51 L50 51 Z" fill="#ff5a1f" opacity="0.5" />
    </svg>
  );
}

/**
 * Logo completo: monograma + nombre + bajada.
 * `compact` achica la bajada para la topbar mobile.
 */
export function Logo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className={compact ? "h-7 w-7 flex-none" : "h-9 w-9 flex-none"} />
      <span className="leading-none">
        <b
          className={`block font-display font-extrabold tracking-[-0.02em] ${
            compact ? "text-[13.5px]" : "text-[15px]"
          }`}
        >
          Brahian González
        </b>
        <span
          className={`mt-1 block font-mono uppercase tracking-[0.14em] text-[var(--ink-faint)] ${
            compact ? "text-[8px]" : "text-[9px]"
          }`}
        >
          Movilidad eléctrica
        </span>
      </span>
    </span>
  );
}
