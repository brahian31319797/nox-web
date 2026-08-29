import Link from "next/link";
import { VehicleIcon } from "@/components/site/icons";
import { getCategorias, getProductosAdmin } from "@/lib/productos";

export default async function AdminCategoriasPage() {
  const [categorias, productos] = await Promise.all([getCategorias(), getProductosAdmin()]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[26px]">Categorías</h1>
        <p className="mt-1 text-[13.5px] text-[var(--ink-soft)]">
          Los tres rubros fijos que organizan el catálogo de la web.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {categorias.map((c) => {
          const count = productos.filter((p) => p.categoria.slug === c.slug).length;
          return (
            <div key={c.id} className="flex flex-col gap-3.5 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-2)]">
                <VehicleIcon categoria={c.slug} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-[17px]">{c.nombre}</h3>
                <div className="mt-0.5 font-mono text-[11.5px] text-[var(--ink-faint)]">
                  {count} {count === 1 ? "producto" : "productos"}
                </div>
              </div>
              <Link
                href={`/admin/productos?categoria=${c.slug}`}
                className="mt-auto rounded-lg border-t border-[var(--line)] pt-3 text-center text-[12.5px] font-bold text-[var(--ink-soft)] hover:text-[var(--accent-2)]"
              >
                Ver productos
              </Link>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-[12.5px] text-[var(--ink-faint)]">
        Las categorías están fijas a estas tres porque cada una tiene su propio ícono y ruta en la web pública. Si en
        algún momento necesitás sumar una categoría nueva (ej. patinetas o cascos), avisame y la agrego al sitio.
      </p>
    </div>
  );
}
