"use server";

import { revalidatePath } from "next/cache";
import { productoSchema } from "@/lib/schemas";
import { autorizarAdmin, errorPublicable, registrarInputInvalido } from "./guard";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Todas las acciones de este archivo empiezan por autorizarAdmin().
 *
 * Una server action es un endpoint POST invocable desde afuera: el middleware
 * protege la navegación a /admin, no la llamada directa. RLS sigue siendo la
 * última barrera, pero no puede ser la única.
 */

function revalidarCatalogo() {
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/admin/categorias");
  revalidatePath("/productos");
  revalidatePath("/");
}

export async function crearProducto(input: unknown): Promise<ActionResult> {
  const auth = await autorizarAdmin("crearProducto");
  if (!auth.ok) return auth;

  const parsed = productoSchema.safeParse(input);
  if (!parsed.success) {
    registrarInputInvalido("crearProducto", parsed.error.issues[0]?.path.join(".") ?? "?");
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { error } = await auth.supabase.from("productos").insert(parsed.data);
  if (error) return { ok: false, error: errorPublicable("crearProducto", error) };

  revalidarCatalogo();
  return { ok: true };
}

export async function actualizarProducto(id: string, input: unknown): Promise<ActionResult> {
  const auth = await autorizarAdmin("actualizarProducto");
  if (!auth.ok) return auth;

  const parsed = productoSchema.safeParse(input);
  if (!parsed.success) {
    registrarInputInvalido("actualizarProducto", parsed.error.issues[0]?.path.join(".") ?? "?");
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { error } = await auth.supabase
    .from("productos")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: errorPublicable("actualizarProducto", error) };

  revalidarCatalogo();
  return { ok: true };
}

export async function eliminarProducto(id: string): Promise<ActionResult> {
  const auth = await autorizarAdmin("eliminarProducto");
  if (!auth.ok) return auth;

  const { error } = await auth.supabase.from("productos").delete().eq("id", id);
  if (error) return { ok: false, error: errorPublicable("eliminarProducto", error) };

  revalidarCatalogo();
  return { ok: true };
}

/** Marca o desmarca un producto como destacado de la portada. */
export async function alternarDestacado(id: string, destacado: boolean): Promise<ActionResult> {
  const auth = await autorizarAdmin("alternarDestacado");
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("productos")
    .update({ destacado, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: errorPublicable("alternarDestacado", error) };

  revalidarCatalogo();
  return { ok: true };
}

/** Publica u oculta sin tener que entrar a editar el producto entero. */
export async function alternarPublicado(id: string, publicado: boolean): Promise<ActionResult> {
  const auth = await autorizarAdmin("alternarPublicado");
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("productos")
    .update({ publicado, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: errorPublicable("alternarPublicado", error) };

  revalidarCatalogo();
  return { ok: true };
}

/**
 * Copia un producto para cargar un modelo parecido sin empezar de cero.
 * La copia nace oculta y sin destacar: así Brahian la termina de editar sin que
 * aparezca a medio hacer en la web.
 */
export async function duplicarProducto(id: string): Promise<ActionResult> {
  const auth = await autorizarAdmin("duplicarProducto");
  if (!auth.ok) return auth;

  const { data: original, error: errorLectura } = await auth.supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (errorLectura) return { ok: false, error: errorPublicable("duplicarProducto", errorLectura) };
  if (!original) return { ok: false, error: "No encontramos el producto que querías duplicar." };

  const { data: ultimo } = await auth.supabase
    .from("productos")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  // El slug es único en la base: buscamos el primer sufijo libre en vez de
  // dejar que el insert falle con un 23505 que no le dice nada a Brahian.
  const { data: parecidos } = await auth.supabase
    .from("productos")
    .select("slug")
    .like("slug", `${original.slug}-copia%`);

  const usados = new Set((parecidos ?? []).map((p: { slug: string }) => p.slug));
  let slug = `${original.slug}-copia`;
  let n = 2;
  while (usados.has(slug)) slug = `${original.slug}-copia-${n++}`;

  // Copiamos todo lo que traiga la fila y sacamos lo que genera la base, en vez
  // de listar campos a mano: así un campo nuevo en la tabla se duplica solo.
  const resto = { ...original };
  delete resto.id;
  delete resto.created_at;
  delete resto.updated_at;

  const { error } = await auth.supabase.from("productos").insert({
    ...resto,
    slug,
    nombre: `${original.nombre} (copia)`,
    publicado: false,
    destacado: false,
    orden: (ultimo?.orden ?? 0) + 1,
  });
  if (error) return { ok: false, error: errorPublicable("duplicarProducto", error) };

  revalidarCatalogo();
  return { ok: true };
}

/**
 * Reescribe el campo `orden` según la secuencia de ids recibida.
 * El catálogo es de decenas de productos, así que actualizar uno por uno en
 * paralelo es más simple que armar un upsert masivo y rinde igual.
 */
export async function reordenarProductos(ids: string[]): Promise<ActionResult> {
  const auth = await autorizarAdmin("reordenarProductos");
  if (!auth.ok) return auth;

  // Un array enorme desde afuera sería una forma barata de generar carga.
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 500) {
    registrarInputInvalido("reordenarProductos", `cantidad=${Array.isArray(ids) ? ids.length : "no-array"}`);
    return { ok: false, error: "La lista de productos no es válida." };
  }

  const resultados = await Promise.all(
    ids.map((id, indice) => auth.supabase.from("productos").update({ orden: indice + 1 }).eq("id", id))
  );

  const fallo = resultados.find((r) => r.error);
  if (fallo?.error) return { ok: false, error: errorPublicable("reordenarProductos", fallo.error) };

  revalidarCatalogo();
  return { ok: true };
}
