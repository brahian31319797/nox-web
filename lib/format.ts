export function fmtArs(n: number): string {
  return "$" + new Intl.NumberFormat("es-AR").format(n);
}

export function fmtUsd(n: number): string {
  return "US$" + new Intl.NumberFormat("es-AR").format(n);
}
