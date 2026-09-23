import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, VehicleIcon } from "@/components/site/icons";
import type { Categoria } from "@/lib/types";

export function CategoryCard({ categoria, count }: { categoria: Categoria; count: number }) {
  return (
    <Link
      href={`/productos?categoria=${categoria.slug}`}
      className="group relative flex min-h-[210px] flex-col justify-end overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-5 transition-transform hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,.55)]"
    >
      {/* Con foto cargada manda la foto; sin foto, el dibujo de siempre, para
          que la portada nunca quede con un hueco mientras se cargan. */}
      {categoria.imagen ? (
        <Image
          src={categoria.imagen}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-[var(--ink)] opacity-[0.09]">
          <VehicleIcon categoria={categoria.slug} className="w-[62%]" />
        </div>
      )}
      <div
        className={`absolute inset-0 ${
          categoria.imagen
            ? "bg-[linear-gradient(180deg,rgba(10,10,11,.15)_20%,rgba(10,10,11,.92)_88%)]"
            : "bg-[linear-gradient(180deg,transparent_30%,var(--surface))]"
        }`}
      />
      <span className="absolute right-[18px] top-[18px] grid h-[34px] w-[34px] place-items-center rounded-full bg-[var(--surface-2)] text-[var(--ink-soft)] transition-all group-hover:-rotate-45 group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)]">
        <ArrowRightIcon className="h-4 w-4" />
      </span>
      <h3 className="relative text-[21px] font-extrabold">{categoria.nombre}</h3>
      <div className="relative mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
        {count} {count === 1 ? "modelo" : "modelos"}
      </div>
    </Link>
  );
}
