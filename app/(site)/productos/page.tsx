import { ProductsExplorer } from "@/components/site/ProductsExplorer";
import { getCategorias, getProductosPublicados } from "@/lib/productos";

export const metadata = {
  title: "Productos — Brahian González",
};

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [productos, categorias] = await Promise.all([getProductosPublicados(), getCategorias()]);

  return (
    <main>
      <div className="mx-auto max-w-[1180px] px-5 pt-11">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
          Catálogo completo
        </span>
        <h1 className="mt-3 text-[clamp(30px,4.5vw,46px)]">Productos</h1>
      </div>
      <ProductsExplorer productos={productos} categorias={categorias} categoriaInicial={categoria} />
    </main>
  );
}
