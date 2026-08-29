import { createSupabaseBrowser } from "./supabase";

/** Sube una foto de producto al bucket público "productos" y devuelve su URL pública. */
export async function subirImagenProducto(file: File): Promise<string> {
  const supabase = createSupabaseBrowser();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("productos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("productos").getPublicUrl(path);
  return data.publicUrl;
}
