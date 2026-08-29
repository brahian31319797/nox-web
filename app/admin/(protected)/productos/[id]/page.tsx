import { notFound } from "next/navigation";
import { ProductoForm } from "@/components/admin/ProductoForm";
import { getCategorias, getProductoByIdAdmin } from "@/lib/productos";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [producto, categorias] = await Promise.all([getProductoByIdAdmin(id), getCategorias()]);
  if (!producto) notFound();

  // key fuerza a React a remontar el formulario de cero al pasar de un
  // producto a otro (ej. editar A y después editar B sin recargar la
  // página) — sin esto, el estado inicial de los campos (incluido el
  // toggle de "Publicado") podía quedar pegado al producto anterior.
  return <ProductoForm key={producto.id} categorias={categorias} producto={producto} />;
}
