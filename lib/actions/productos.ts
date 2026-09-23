"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";
import { productoSchema } from "@/lib/schemas";

export type ActionResult = { ok: true } | { ok: false; error: string };

function checkConfigured(): ActionResult | null {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { ok: false, error: "Supabase todavía no está conectado (falta .env.local)." };
  }
  return null;
}

function revalidarCatalogo() {
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath("/");
}

export async function crearProducto(input: unknown): Promise<ActionResult> {
  const notConfigured = checkConfigured();
  if (notConfigured) return notConfigured;

  const parsed = productoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("productos").insert(parsed.data);
  if (error) {
    return { ok: false, error: error.code === "23505" ? "Ya existe un producto con ese slug." : error.message };
  }

  revalidarCatalogo();
  return { ok: true };
}

export async function actualizarProducto(id: string, input: unknown): Promise<ActionResult> {
  const notConfigured = checkConfigured();
  if (notConfigured) return notConfigured;

  const parsed = productoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("productos")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { ok: false, error: error.code === "23505" ? "Ya existe un producto con ese slug." : error.message };
  }

  revalidarCatalogo();
  return { ok: true };
}

export async function eliminarProducto(id: string): Promise<ActionResult> {
  const notConfigured = checkConfigured();
  if (notConfigured) return notConfigured;

  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidarCatalogo();
  return { ok: true };
}

/** Marca o desmarca un producto como destacado de la portada. */
export async function alternarDestacado(id: string, destacado: boolean): Promise<ActionResult> {
  const notConfigured = checkConfigured();
  if (notConfigured) return notConfigured;

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("productos")
    .update({ destacado, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidarCatalogo();
  return { ok: true };
}

/** Publica u oculta sin tener que entrar a editar el producto entero. */
export async function alternarPublicado(id: string, publicado: boolean): Promise<ActionResult> {
  const notConfigured = checkConfigured();
  if (notConfigured) return notConfigured;

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("productos")
    .update({ publicado, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidarCatalogo();
  return { ok: true };
}

/**
 * Copia un producto para cargar un modelo parecido sin empezar de cero.
 * La copia nace oculta y sin destacar: así Brahian la termina de editar sin que
 * aparezca a medio hacer en la web.
 */
export async function duplicarProducto(id: string): Promise<ActionResult> {
  const notConfigured = checkConfigured();
  if (notConfigured) return notConfigured;

  const supabase = await createSupabaseServer();
  const { data: original, error: errorLectura } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (errorLectura) return { ok: false, error: errorLectura.message };
  if (!original) return { ok: false, error: "No encontramos el producto que querías duplicar." };

  const { data: ultimo } = await supabase
    .from("productos")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  // El slug es único en la base: buscamos el primer sufijo libre en vez de
  // dejar que el insert falle con un 23505 que no le dice nada a Brahian.
  const { data: parecidos } = await supabase
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

  const { error } = await supabase.from("productos").insert({
    ...resto,
    slug,
    nombre: `${original.nombre} (copia)`,
    publicado: false,
    destacado: false,
    orden: (ultimo?.orden ?? 0) + 1,
  });
  if (error) return { ok: false, error: error.message };

  revalidarCatalogo();
  return { ok: true };
}

/**
 * Reescribe el campo `orden` según la secuencia de ids recibida.
 * El catálogo es de decenas de productos, así que actualizar uno por uno en
 * paralelo es más simple que armar un upsert masivo y rinde igual.
 */
export async function reordenarProductos(ids: string[]): Promise<ActionResult> {
  const notConfigured = checkConfigured();
  if (notConfigured) return notConfigured;

  const supabase = await createSupabaseServer();
  const resultados = await Promise.all(
    ids.map((id, indice) => supabase.from("productos").update({ orden: indice + 1 }).eq("id", id))
  );

  const fallo = resultados.find((r) => r.error);
  if (fallo?.error) return { ok: false, error: fallo.error.message };

  revalidarCatalogo();
  return { ok: true };
}
