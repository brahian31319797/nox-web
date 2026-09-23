"use client";

import { useMemo, useState } from "react";
import { fmtArs, digitsFromInput } from "@/lib/format";
import { buildAhorroWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/site/icons";
import { SectionHeader } from "@/components/site/SectionHeader";
import type { Producto } from "@/lib/types";

/** Semanas promedio por mes (52 / 12). Evita el error de multiplicar por 4. */
const SEMANAS_POR_MES = 52 / 12;

/** Atajos de gasto semanal para que la persona no tenga que tipear. */
const ATAJOS = [5000, 10000, 15000, 25000];

/**
 * La pieza que vuelve concreta la propuesta de marca: convierte "me gustaría"
 * en "me conviene". Ningún número está inventado — el gasto lo pone la persona
 * y el precio sale del catálogo real. Ver docs/manual-de-marca.md §8.
 */
export function SavingsCalculator({ productos }: { productos: Producto[] }) {
  const ordenados = useMemo(
    () => [...productos].filter((p) => p.precio_ars > 0).sort((a, b) => a.precio_ars - b.precio_ars),
    [productos]
  );

  const [gastoSemanal, setGastoSemanal] = useState(10000);
  const [productoId, setProductoId] = useState(ordenados[0]?.id ?? "");

  const elegido = ordenados.find((p) => p.id === productoId) ?? ordenados[0];

  const cuenta = useMemo(() => {
    if (!elegido || gastoSemanal <= 0) return null;
    const mensual = gastoSemanal * SEMANAS_POR_MES;
    const meses = Math.ceil(elegido.precio_ars / mensual);
    return { mensual, meses, anual: gastoSemanal * 52 };
  }, [elegido, gastoSemanal]);

  // Arriba de 5 años el argumento del ahorro deja de ser honesto: mejor decirlo.
  const demasiadoLargo = cuenta !== null && cuenta.meses > 60;

  if (!elegido) return null;

  return (
    <section id="calculadora" className="scroll-mt-20 border-y border-[var(--line)] bg-[var(--surface)] px-5 py-16">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader
          numero="03"
          titulo="¿Cuánto se te va en moverte?"
          bajada="Poné lo que gastás por semana en nafta, colectivo o remis y te digo en cuánto tiempo el vehículo se termina de pagar solo."
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-5">
          {/* ─── Entradas ─────────────────────────────────────────── */}
          <div className="rounded-[18px] border border-[var(--line)] bg-[var(--canvas)] p-6 md:p-7">
            <label htmlFor="gasto" className="block text-[13px] font-bold text-[var(--ink)]">
              ¿Cuánto gastás por semana en moverte?
            </label>
            <div className="mt-3 flex h-[62px] items-center gap-2 rounded-[13px] border-[1.5px] border-[var(--line-strong)] bg-[var(--surface)] px-4 focus-within:border-[var(--money)]">
              <span className="font-display text-[22px] font-extrabold text-[var(--ink-faint)]">$</span>
              <input
                id="gasto"
                inputMode="numeric"
                value={new Intl.NumberFormat("es-AR").format(gastoSemanal)}
                onChange={(e) => setGastoSemanal(Number(digitsFromInput(e.target.value)))}
                className="w-full bg-transparent font-display text-[26px] font-extrabold tracking-tight text-[var(--ink)] outline-none"
                aria-describedby="gasto-ayuda"
              />
              <span id="gasto-ayuda" className="flex-none font-mono text-[11px] text-[var(--ink-faint)]">
                por semana
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {ATAJOS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setGastoSemanal(v)}
                  className={`rounded-full border px-3.5 py-2 font-mono text-[12px] transition-colors ${
                    gastoSemanal === v
                      ? "border-[var(--money-line)] bg-[var(--money-soft)] text-[var(--money)]"
                      : "border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  {fmtArs(v)}
                </button>
              ))}
            </div>

            <label htmlFor="modelo" className="mt-7 block text-[13px] font-bold text-[var(--ink)]">
              ¿Qué modelo estás mirando?
            </label>
            <select
              id="modelo"
              value={elegido.id}
              onChange={(e) => setProductoId(e.target.value)}
              className="mt-3 h-[52px] w-full rounded-[13px] border-[1.5px] border-[var(--line-strong)] bg-[var(--surface)] px-4 text-[14.5px] font-semibold text-[var(--ink)] outline-none focus:border-[var(--money)]"
            >
              {ordenados.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {fmtArs(p.precio_ars)}
                </option>
              ))}
            </select>
          </div>

          {/* ─── Resultado ────────────────────────────────────────── */}
          <div className="flex flex-col rounded-[18px] border border-[var(--money-line)] bg-[var(--money-soft)] p-6 md:p-7">
            {cuenta === null ? (
              <p className="m-auto text-center text-[15px] text-[var(--ink-soft)]">
                Poné cuánto gastás por semana y te hacemos la cuenta.
              </p>
            ) : demasiadoLargo ? (
              <div className="m-auto text-center">
                <p className="text-[15.5px] leading-relaxed text-[var(--ink)]">
                  Para ese gasto te conviene un modelo más accesible.
                </p>
                <p className="mt-3 text-[14px] text-[var(--ink-soft)]">
                  Probá con otro de la lista, o escribime y te ayudo a encontrar el que mejor te
                  cierra.
                </p>
              </div>
            ) : (
              <>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--money)]">
                  Se paga solo en
                </span>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="font-display text-[clamp(60px,11vw,96px)] font-black leading-[0.85] tracking-[-0.05em] text-[var(--money-2)]">
                    {cuenta.meses}
                  </span>
                  <span className="font-display text-[26px] font-extrabold text-[var(--money)]">
                    {cuenta.meses === 1 ? "mes" : "meses"}
                  </span>
                </div>

                <dl className="mt-7 space-y-3 border-t border-[var(--money-line)] pt-5 text-[14px]">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[var(--ink-soft)]">Lo que gastás por mes</dt>
                    <dd className="font-mono font-bold text-[var(--ink)]">{fmtArs(Math.round(cuenta.mensual))}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[var(--ink-soft)]">En un año</dt>
                    <dd className="font-mono font-bold text-[var(--ink)]">{fmtArs(cuenta.anual)}</dd>
                  </div>
                </dl>

                <p className="mt-5 text-[14.5px] leading-relaxed text-[var(--ink)]">
                  A partir del mes {cuenta.meses}, esos{" "}
                  <b className="text-[var(--money-2)]">{fmtArs(Math.round(cuenta.mensual))}</b> por mes
                  se quedan en tu bolsillo.
                </p>

                <a
                  href={buildAhorroWhatsAppUrl(elegido, cuenta.meses)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--money)] px-[22px] py-[14px] text-[15px] font-bold text-[var(--canvas)] transition-transform hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  Consultar por este modelo
                </a>
              </>
            )}
          </div>
        </div>

        <p className="mt-5 text-[12.5px] text-[var(--ink-faint)]">
          La cuenta toma solo lo que hoy gastás en transporte.
        </p>
      </div>
    </section>
  );
}
