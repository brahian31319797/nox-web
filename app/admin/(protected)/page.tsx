import Link from "next/link";
import { getCategorias, getProductosAdmin } from "@/lib/productos";
import { AlertIcon, CheckIcon, ExternalLinkIcon, PlusIcon, StarIcon } from "@/components/admin/icons";
import type { Producto } from "@/lib/types";

/**
 * Antes /admin solo redirigía a la lista de productos. Este panel existe para
 * responder la única pregunta que Brahian se hace al entrar: ¿me falta algo?
 */

/** Qué le falta a un producto para estar listo para la web. */
function pendientesDe(p: Producto): string[] {
  const faltas: string[] = [];
  if (p.imagenes.length === 0) faltas.push("Sin foto");
  if (p.precio_ars <= 0) faltas.push("Sin precio");
  if (!p.descripcion?.trim()) faltas.push("Sin descripción");
  if (!p.entrega?.trim()) faltas.push("Sin plazo de entrega");
  if (p.specs.length === 0) faltas.push("Sin características");
  return faltas;
}

export default async function AdminInicioPage() {
  const [productos, categorias] = await Promise.all([getProductosAdmin(), getCategorias()]);

  const publicados = productos.filter((p) => p.publicado);
  const ocultos = productos.filter((p) => !p.publicado);
  const destacados = publicados.filter((p) => p.destacado);

  // Solo nos importan los pendientes de lo que ya está a la vista del público.
  const conPendientes = publicados
    .map((p) => ({ producto: p, faltas: pendientesDe(p) }))
    .filter((x) => x.faltas.length > 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px]">Panel</h1>
          <p className="mt-1 text-[13.5px] text-[var(--ink-soft)]">
            Un vistazo rápido al estado de la web.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2.5 text-sm font-bold text-[var(--ink-soft)] hover:text-[var(--ink)]"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            Ver la web
          </Link>
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-[var(--accent-ink)]"
          >
            <PlusIcon className="h-4 w-4" />
            Nuevo producto
          </Link>
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-3">
        <Metrica valor={publicados.length} label="En la web" detalle={`${categorias.length} categorías`} />
        <Metrica valor={destacados.length} label="En la portada" detalle="Marcados con estrella" acento />
        <Metrica valor={ocultos.length} label="Ocultos" detalle="No los ve nadie" apagado />
      </div>

      {destacados.length === 0 && publicados.length > 0 && (
        <Aviso>
          No marcaste ningún producto como destacado, así que la portada está mostrando los tres
          primeros del catálogo. Tocá la estrella en{" "}
          <Link href="/admin/productos" className="font-bold underline">
            Productos
          </Link>{" "}
          para elegir cuáles querés que aparezcan.
        </Aviso>
      )}

      {destacados.length > 3 && (
        <Aviso>
          Tenés {destacados.length} productos destacados pero en la portada entran 3. Se muestran los
          tres primeros según el orden del catálogo.
        </Aviso>
      )}

      <section className="mt-8">
        <h2 className="text-[19px]">Qué falta completar</h2>
        <p className="mt-1 text-[13.5px] text-[var(--ink-soft)]">
          Productos que ya están publicados pero les falta información.
        </p>

        {conPendientes.length === 0 ? (
          <div className="mt-4 flex items-center gap-3 rounded-[14px] border border-[var(--ok-soft)] bg-[var(--ok-soft)] p-5">
            <CheckIcon className="h-5 w-5 flex-none text-[var(--ok)]" />
            <p className="text-[14px] text-[var(--ink)]">
              Está todo completo. Los {publicados.length} productos publicados tienen foto, precio,
              descripción, características y plazo de entrega.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--surface)]">
            {conPendientes.map(({ producto, faltas }) => (
              <Link
                key={producto.id}
                href={`/admin/productos/${producto.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--line)] px-4 py-3.5 first:border-t-0 hover:bg-[var(--surface-2)]"
              >
                <span className="min-w-[160px] flex-1 text-[14px] font-bold">{producto.nombre}</span>
                <span className="flex flex-wrap gap-1.5">
                  {faltas.map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-[var(--danger-soft)] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide text-[var(--danger)]"
                    >
                      {f}
                    </span>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Metrica({
  valor,
  label,
  detalle,
  acento = false,
  apagado = false,
}: {
  valor: number;
  label: string;
  detalle: string;
  acento?: boolean;
  apagado?: boolean;
}) {
  return (
    <div
      className={`rounded-[14px] border bg-[var(--surface)] p-5 ${
        acento ? "border-[var(--accent-soft)]" : "border-[var(--line)]"
      }`}
    >
      <div className="flex items-center gap-2">
        {acento && <StarIcon filled className="h-4 w-4 text-[var(--accent-2)]" />}
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          {label}
        </span>
      </div>
      <div
        className={`mt-1.5 font-display text-[38px] font-black leading-none tracking-tight ${
          apagado ? "text-[var(--ink-faint)]" : acento ? "text-[var(--accent-2)]" : "text-[var(--ink)]"
        }`}
      >
        {valor}
      </div>
      <div className="mt-1.5 text-[12.5px] text-[var(--ink-soft)]">{detalle}</div>
    </div>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-[12px] border border-[rgba(255,138,61,.28)] bg-[var(--accent-soft)] p-4 text-[13.5px] leading-relaxed text-[var(--ink)]">
      <AlertIcon className="mt-0.5 h-4 w-4 flex-none text-[var(--accent-2)]" />
      <p>{children}</p>
    </div>
  );
}
