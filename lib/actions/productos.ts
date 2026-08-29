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
