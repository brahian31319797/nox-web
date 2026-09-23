"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, VehicleIcon, XIcon, ZoomIcon } from "@/components/site/icons";
import type { Categoria } from "@/lib/types";

export function ProductGallery({
  imagenes,
  nombre,
  categoria,
  etiqueta,
}: {
  imagenes: string[];
  nombre: string;
  categoria: Categoria;
  etiqueta: string | null;
}) {
  const [activa, setActiva] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const tieneFotos = imagenes.length > 0;

  const mover = useCallback(
    (paso: number) => setActiva((i) => (i + paso + imagenes.length) % imagenes.length),
    [imagenes.length]
  );

  // Con el visor abierto, Escape cierra y las flechas cambian de foto: es lo
  // que espera cualquiera que ya usó un visor de imágenes.
  useEffect(() => {
    if (!ampliada) return;

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAmpliada(false);
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };

    // Sin esto la página de atrás sigue scrolleando bajo el visor.
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", alTeclear);

    return () => {
      document.body.style.overflow = overflowPrevio;
      window.removeEventListener("keydown", alTeclear);
    };
  }, [ampliada, mover]);

  return (
    <div>
      <div
        className={`relative grid aspect-[4/3.2] place-items-center overflow-hidden rounded-[26px] border border-[var(--line)] ${
          tieneFotos ? "bg-[#f1efe9]" : "bg-[radial-gradient(120%_100%_at_50%_10%,var(--surface-3),var(--surface-2))]"
        }`}
      >
        {etiqueta && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-[var(--accent)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--accent-ink)]">
            {etiqueta}
          </span>
        )}

        {tieneFotos ? (
          <button
            type="button"
            onClick={() => setAmpliada(true)}
            aria-label={`Ampliar la foto de ${nombre}`}
            className="group absolute inset-0 cursor-zoom-in"
          >
            <Image
              key={imagenes[activa]}
              src={imagenes[activa]}
              alt={nombre}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-contain p-8 transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-[rgba(10,10,11,.72)] text-[var(--ink)] backdrop-blur-sm transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)]">
              <ZoomIcon className="h-[18px] w-[18px]" />
            </span>
          </button>
        ) : (
          <VehicleIcon categoria={categoria.slug} className="w-[76%] text-[var(--ink)]" />
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {imagenes.map((url, i) => (
            <button
              key={url}
              onClick={() => setActiva(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === activa}
              className={`aspect-square overflow-hidden rounded-[12px] border-[1.5px] bg-[#f1efe9] transition-opacity ${
                i === activa ? "border-[var(--accent)]" : "border-[var(--line)] opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={url} alt="" width={120} height={120} className="h-full w-full object-contain p-2" />
            </button>
          ))}
        </div>
      )}

      {ampliada && tieneFotos && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos de ${nombre}`}
          onClick={() => setAmpliada(false)}
          className="fixed inset-0 z-[90] flex flex-col bg-[rgba(6,6,7,.94)] backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 md:px-6">
            <span className="min-w-0 truncate font-mono text-[12px] text-[var(--ink-soft)]">
              {imagenes.length > 1 ? `${activa + 1} / ${imagenes.length} · ` : ""}
              {nombre}
            </span>
            <button
              type="button"
              onClick={() => setAmpliada(false)}
              aria-label="Cerrar"
              className="grid h-11 w-11 flex-none place-items-center rounded-full border border-[var(--line-strong)] text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)]"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* El click en el fondo cierra; dentro de la imagen no, para poder
              mirarla sin que se cierre de casualidad. */}
          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <Image
              key={imagenes[activa]}
              src={imagenes[activa]}
              alt={`${nombre} — foto ${activa + 1}`}
              fill
              sizes="100vw"
              className="object-contain p-3 md:p-8"
            />
          </div>

          {imagenes.length > 1 && (
            <div
              className="flex items-center justify-center gap-3 px-4 py-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => mover(-1)}
                aria-label="Foto anterior"
                className="grid h-12 w-12 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)]"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              {/* El punto mide 8px pero el área que recibe el dedo es de 44:
                  el indicador chico es a propósito, el blanco de toque no. */}
              <div className="flex">
                {imagenes.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => setActiva(i)}
                    aria-label={`Ir a la foto ${i + 1}`}
                    aria-current={i === activa}
                    className="grid h-11 w-5 place-items-center"
                  >
                    <span
                      className={`block h-2 rounded-full transition-all ${
                        i === activa ? "w-6 bg-[var(--accent)]" : "w-2 bg-[var(--line-strong)]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => mover(1)}
                aria-label="Foto siguiente"
                className="grid h-12 w-12 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)]"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
