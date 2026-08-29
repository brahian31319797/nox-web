export function fmtArs(n: number): string {
  return "$" + new Intl.NumberFormat("es-AR").format(n);
}

export function fmtUsd(n: number): string {
  return "US$" + new Intl.NumberFormat("es-AR").format(n);
}

const decimalFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formatea un string de "centavos" (solo dígitos, ej. "75043922") como
 * "750.439,22" — para inputs de dinero que se van armando dígito a dígito
 * de derecha a izquierda, estilo cajero/billetera.
 */
export function centsToDecimalDisplay(centsDigits: string): string {
  const cents = centsDigits === "" ? 0 : Number(centsDigits);
  return decimalFormatter.format(cents / 100);
}

/** Extrae solo dígitos de lo que el usuario tenga tipeado, sin ceros a la izquierda. */
export function digitsFromInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return String(digits === "" ? 0 : Number(digits));
}
