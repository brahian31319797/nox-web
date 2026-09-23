import { CategoriasManager } from "@/components/admin/CategoriasManager";
import { getCategorias, getProductosAdmin } from "@/lib/productos";

export default async function AdminCategoriasPage() {
  const [categorias, productos] = await Promise.all([getCategorias(), getProductosAdmin()]);

  const conteos = productos.reduce<Record<string, number>>((acc, p) => {
    acc[p.categoria.slug] = (acc[p.categoria.slug] ?? 0) + 1;
    return acc;
  }, {});

  return <CategoriasManager categorias={categorias} conteos={conteos} />;
}
