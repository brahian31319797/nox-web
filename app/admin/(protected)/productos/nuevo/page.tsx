import { ProductoForm } from "@/components/admin/ProductoForm";
import { getCategorias } from "@/lib/productos";

export default async function NuevoProductoPage() {
  const categorias = await getCategorias();
  return <ProductoForm categorias={categorias} />;
}
