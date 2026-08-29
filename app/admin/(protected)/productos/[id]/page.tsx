import { notFound } from "next/navigation";
import { ProductoForm } from "@/components/admin/ProductoForm";
import { getCategorias, getProductoByIdAdmin } from "@/lib/productos";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [producto, categorias] = await Promise.all([getProductoByIdAdmin(id), getCategorias()]);
  if (!producto) notFound();

  return <ProductoForm categorias={categorias} producto={producto} />;
}
