import Image from "next/image";
import Link from "next/link";
import { BoltSpecIcon, VehicleIcon, WhatsAppIcon } from "@/components/site/icons";
import { fmtArs, fmtUsd } from "@/lib/format";
import type { Producto } from "@/lib/types";

const CAT_LABEL: Record<string, string> = {
  monopatin: "Monopatín",
  moto: "Moto",
  bici: "Bici",
};

export function ProductCard({ producto }: { producto: Producto }) {
  const tieneFotos = producto.imagenes.length > 0;
  const specsDestacadas = producto.specs.slice(0, 3);

  return (
    <Link
      href={`/productos/${producto.slug}`}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--surface)] transition-transform hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,.55)]"
    >
      <div
        className={`relative grid aspect-[4/3] place-items-center border-b border-[var(--line)] ${
          tieneFotos ? "bg-[#f1efe9]" : "bg-[radial-gradient(120%_100%_at_50%_0%,var(--surface-3),var(--surface-2))]"
        }`}
      >
        {producto.etiqueta && (
          <span className="absolute left-2 top-2 z-10 max-w-[46%] truncate rounded-full bg-[var(--accent)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--accent-ink)]">
            {producto.etiqueta}
          </span>
        )}
        <span className="absolute right-2 top-2 z-10 max-w-[46%] truncate rounded-full border border-[var(--line)] bg-[var(--surface)]/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)] backdrop-blur-sm">
          {CAT_LABEL[producto.categoria.slug]}
        </span>
        {tieneFotos ? (
          <Image
            src={producto.imagenes[0]}
            alt={producto.nombre}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <VehicleIcon
            categoria={producto.categoria.slug}
            className="w-[74%] text-[var(--ink)] opacity-90 transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-[1.06]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-[18px] font-bold leading-snug tracking-tight">{producto.nombre}</h3>

        {specsDestacadas.length > 0 && (
          <div className="flex flex-wrap gap-x-3.5 gap-y-1">
            {specsDestacadas.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5 font-mono text-[11.5px] text-[var(--ink-soft)]">
                <BoltSpecIcon className="h-3.5 w-3.5 flex-none text-[var(--accent)]" />
                {s.value}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-0.5 border-t border-[var(--line)] pt-2 min-[420px]:flex-row min-[420px]:items-baseline min-[420px]:justify-between">
          <span className="font-display text-[19px] font-extrabold tracking-tight tabular-nums md:text-[21px]">
            {fmtArs(producto.precio_ars)}
          </span>
          <span className="font-mono text-[12px] text-[var(--ink-faint)]">{fmtUsd(producto.precio_usd)}</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 rounded-[10px] bg-[var(--surface-2)] py-2.5 text-[13.5px] font-bold text-[var(--ink)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)]">
          <WhatsAppIcon className="h-3.5 w-3.5" />
          Consultar
        </div>
      </div>
    </Link>
  );
}
