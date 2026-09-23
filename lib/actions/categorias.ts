"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { urlImagenSchema } from "@/lib/schemas";
import { autorizarAdmin, errorPublicable, registrarInputInvalido } from "./guard";
import type { ActionResult } from "./productos";

/**
 * Las categorías son tres y están fijas (cada una tiene su ícono y su ruta en
 * la web), así que no hay alta ni baja: lo único editable es el nombre que ve
 * el cliente y la foto de portada.
 */
const cambiosSchema = z.object({
  id: z.string().uuid("Categoría inválida"),
  nombre: z.string().trim().min(1, "El nombre no puede quedar vacío").max(60).optional(),
  // null es válido y significa "sacar la foto"; cualquier otra cosa tiene que
  // ser una URL de nuestro propio storage.
  imagen: urlImagenSchema.nullable().optional(),
});

export async function actualizarCategoria(
  id: string,
  campos: { nombre?: string; imagen?: string | null }
): Promise<ActionResult> {
  const auth = await autorizarAdmin("actualizarCategoria");
  if (!auth.ok) return auth;

  const parsed = cambiosSchema.safeParse({ id, ...campos });
  if (!parsed.success) {
    const problema = parsed.error.issues[0];
    registrarInputInvalido("actualizarCategoria", problema?.path.join(".") ?? "?");
    return { ok: false, error: problema?.message ?? "Datos inválidos" };
  }

  const { id: idValidado, ...cambios } = parsed.data;
  if (Object.keys(cambios).length === 0) return { ok: true };

  const { error } = await auth.supabase.from("categorias").update(cambios).eq("id", idValidado);
  if (error) return { ok: false, error: errorPublicable("actualizarCategoria", error) };

  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
  revalidatePath("/productos");
  revalidatePath("/");
  return { ok: true };
}
