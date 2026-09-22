import { createSupabaseServer } from "./supabase-server";
import { CATEGORIAS_SEED, PRODUCTOS_SEED } from "./seed-data";
import type { Categoria, Producto } from "./types";

/**
 * Regla de oro: los datos de ejemplo (lib/seed-data.ts) son SOLO para levantar
 * el proyecto en local sin credenciales. Nunca se usan para tapar una falla de
 * Supabase.
 *
 * Por qué: si la base se cae y el sitio sigue mostrando el catálogo de ejemplo,
 * un cliente consulta por WhatsApp por un producto que no existe, a un precio
 * que no es. Pasó el 22/09/2026 con el proyecto de Supabase pausado. Ante un
 * error preferimos una sección vacía y honesta antes que un catálogo inventado.
 */
const supabaseConfigurado = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const usarDatosDeEjemplo = !supabaseConfigurado && process.env.NODE_ENV === "development";

if (!supabaseConfigurado && process.env.NODE_ENV === "production") {
  // Falta configuración en el deploy: fallar acá es mejor que servir un catálogo falso.
  throw new Error(
    "Falta NEXT_PUBLIC_SUPABASE_URL. Configurá las variables de entorno en Vercel antes de desplegar."
  );
}

/** true cuando el catálogo que se está sirviendo es de ejemplo, no el real. */
export const catalogoEsDeEjemplo = usarDatosDeEjemplo;

export async function getCategorias(): Promise<Categoria[]> {
  if (usarDatosDeEjemplo) return CATEGORIAS_SEED;

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.from("categorias").select("*").order("orden");
  if (error) {
    console.error("[getCategorias]", error.message);
    return [];
  }
  return data as Categoria[];
}

export async function getProductosPublicados(): Promise<Producto[]> {
  if (usarDatosDeEjemplo) return PRODUCTOS_SEED.filter((p) => p.publicado);

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("productos")
    .select("*, categoria:categorias(*)")
    .eq("publicado", true)
    .order("orden");
  if (error) {
    console.error("[getProductosPublicados]", error.message);
    return [];
  }
  return data as Producto[];
}

export async function getProductoBySlug(slug: string): Promise<Producto | null> {
  if (usarDatosDeEjemplo) {
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
  if (usarDatosDeEjemplo) return PRODUCTOS_SEED.find((p) => p.id === id) ?? null;

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
  if (usarDatosDeEjemplo) return PRODUCTOS_SEED;

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("productos")
    .select("*, categoria:categorias(*)")
    .order("orden");
  if (error) {
    console.error("[getProductosAdmin]", error.message);
    return [];
  }
  return data as Producto[];
}
