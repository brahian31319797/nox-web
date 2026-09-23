/**
 * Los precios se muestran siempre con dos decimales, igual que en el
 * formulario del panel: si el admin carga 1.250.000,00 y la web muestra
 * 1.250.000, parecen dos precios distintos.
 */
const decimalFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function fmtArs(n: number): string {
  return "$" + decimalFormatter.format(n);
}

export function fmtUsd(n: number): string {
  return "US$" + decimalFormatter.format(n);
}

/** Solo el número, sin símbolo: para cuando la moneda ya está rotulada aparte. */
export function fmtNumero(n: number): string {
  return decimalFormatter.format(n);
}

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
