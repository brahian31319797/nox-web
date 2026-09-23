import { ProductsExplorer } from "@/components/site/ProductsExplorer";
import { getCategorias, getProductosPublicados } from "@/lib/productos";

export const metadata = {
  title: "Productos",
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
        <h1 className="text-[clamp(30px,6vw,46px)]">Catálogo</h1>
      </div>
      <ProductsExplorer productos={productos} categorias={categorias} categoriaInicial={categoria} />
    </main>
  );
}
