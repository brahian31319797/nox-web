"use client";

import Image from "next/image";
import { useState } from "react";
import { VehicleIcon } from "@/components/site/icons";
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
  const tieneFotos = imagenes.length > 0;

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
          <Image
            key={imagenes[activa]}
            src={imagenes[activa]}
            alt={nombre}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-contain p-8"
          />
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
              className={`aspect-square overflow-hidden rounded-[12px] border-[1.5px] bg-[#f1efe9] transition-opacity ${
                i === activa ? "border-[var(--accent)]" : "border-[var(--line)] opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={url} alt="" width={120} height={120} className="h-full w-full object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
