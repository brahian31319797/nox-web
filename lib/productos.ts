import { createSupabaseServer } from "./supabase-server";
import { CATEGORIAS_SEED, PRODUCTOS_SEED } from "./seed-data";
import type { Categoria, Producto } from "./types";

/**
 * Mientras no exista un proyecto de Supabase conectado (NEXT_PUBLIC_SUPABASE_URL
 * vacío), el sitio se sirve con lib/seed-data.ts. Ni bien esas variables estén
 * seteadas en .env.local, estas mismas funciones empiezan a leer de la base
 * real sin que haya que tocar ninguna página ni componente.
 */
const supabaseConfigurado = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export async function getCategorias(): Promise<Categoria[]> {
  if (!supabaseConfigurado) return CATEGORIAS_SEED;

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.from("categorias").select("*").order("orden");
  if (error) {
    console.error("[getCategorias]", error.message);
    return CATEGORIAS_SEED;
  }
  return data as Categoria[];
}

export async function getProductosPublicados(): Promise<Producto[]> {
  if (!supabaseConfigurado) return PRODUCTOS_SEED.filter((p) => p.publicado);

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("productos")
    .select("*, categoria:categorias(*)")
    .eq("publicado", true)
    .order("orden");
  if (error) {
    console.error("[getProductosPublicados]", error.message);
    return PRODUCTOS_SEED.filter((p) => p.publicado);
  }
  return data as Producto[];
}

export async function getProductoBySlug(slug: string): Promise<Producto | null> {
  if (!supabaseConfigurado) {
    return PRODUCTOS_SEED.find((p) => p.slug === slug && p.publicado) ?? null;
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("productos")
    .select("*, categoria:categorias(*)")
    .eq("slug", slug)
    .eq("publicado", true)
    .maybeSingle();
  if (error) {
    console.error("[getProductoBySlug]", error.message);
    return null;
  }
  return data as Producto | null;
}

/** Un producto por id, incluso oculto — solo para el panel admin. */
export async function getProductoByIdAdmin(id: string): Promise<Producto | null> {
  if (!supabaseConfigurado) return PRODUCTOS_SEED.find((p) => p.id === id) ?? null;

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("productos")
    .select("*, categoria:categorias(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[getProductoByIdAdmin]", error.message);
    return null;
  }
  return data as Producto | null;
}

/** Todos los productos (incluye ocultos) — solo para el panel admin. */
export async function getProductosAdmin(): Promise<Producto[]> {
  if (!supabaseConfigurado) return PRODUCTOS_SEED;

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("productos")
    .select("*, categoria:categorias(*)")
    .order("orden");
  if (error) {
    console.error("[getProductosAdmin]", error.message);
    return PRODUCTOS_SEED;
  }
  return data as Producto[];
}
