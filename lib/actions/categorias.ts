"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";
import type { ActionResult } from "./productos";

/**
 * Las categorías son tres y están fijas (cada una tiene su ícono y su ruta en
 * la web), así que no hay alta ni baja: lo único editable es el nombre que ve
 * el cliente y la foto de portada.
 */
export async function actualizarCategoria(
  id: string,
  campos: { nombre?: string; imagen?: string | null }
): Promise<ActionResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { ok: false, error: "Supabase todavía no está conectado (falta .env.local)." };
  }

  const cambios: { nombre?: string; imagen?: string | null } = {};
  if (campos.nombre !== undefined) {
    const nombre = campos.nombre.trim();
    if (!nombre) return { ok: false, error: "El nombre no puede quedar vacío." };
    cambios.nombre = nombre;
  }
  if (campos.imagen !== undefined) cambios.imagen = campos.imagen;

  if (Object.keys(cambios).length === 0) return { ok: true };

  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("categorias").update(cambios).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/categorias");
  revalidatePath("/productos");
  revalidatePath("/");
  return { ok: true };
}
