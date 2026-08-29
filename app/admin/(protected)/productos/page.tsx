import { ProductosTable } from "@/components/admin/ProductosTable";
import { getCategorias, getProductosAdmin } from "@/lib/productos";

export default async function AdminProductosPage() {
  const [productos, categorias] = await Promise.all([getProductosAdmin(), getCategorias()]);
  return <ProductosTable productos={productos} categorias={categorias} />;
}
