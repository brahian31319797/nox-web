/**
 * Los tres diferenciales reales (manual de marca §4).
 *
 * Reemplaza a la grilla de tres tarjetas con ícono redondo, título y párrafo:
 * ese bloque aparece idéntico en miles de sitios y era lo que más delataba
 * plantilla. Acá la referencia es un tablero de señalética —celdas divididas
 * por líneas, dato grande arriba— que además es el lenguaje visual del rubro.
 */
const DATOS = [
  { dato: "Financiación", unidad: "a convenir", desc: "Escribime y vemos la forma de pago que mejor te sirva.", money: true },
  { dato: "24", unidad: "provincias", desc: "Envío a todo el país. Te confirmo el plazo antes de que pagues.", money: false },
  { dato: "1 a 1", unidad: "por WhatsApp", desc: "Te asesoro yo, antes y después de la compra.", money: false },
];

export function TrustBar() {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-[1180px] sm:grid-cols-3">
        {DATOS.map((d, i) => (
          <div
            key={d.dato}
            className={`px-5 py-6 md:px-7 md:py-8 ${
              i > 0 ? "border-t border-[var(--line)] sm:border-l sm:border-t-0" : ""
            }`}
          >
            <div className="flex items-baseline gap-2">
              <span
                className={`font-display font-black leading-none tracking-[-0.04em] ${
                  d.dato.length > 6 ? "text-[26px] md:text-[30px]" : "text-[34px] md:text-[40px]"
                } ${d.money ? "text-[var(--money)]" : "text-[var(--ink)]"}`}
              >
                {d.dato}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                {d.unidad}
              </span>
            </div>
            <p className="mt-2.5 max-w-[34ch] text-[13.5px] leading-relaxed text-[var(--ink-soft)]">{d.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
