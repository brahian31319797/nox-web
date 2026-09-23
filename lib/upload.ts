import { createSupabaseBrowser } from "./supabase";

/**
 * Sube una imagen al bucket público "productos" y devuelve su URL pública.
 * `carpeta` separa las portadas de categoría de las fotos de producto sin
 * necesidad de un bucket aparte: las políticas de acceso del bucket ya están
 * puestas y probadas, duplicarlas solo agrega superficie para equivocarse.
 */
async function subirA(file: File, carpeta = ""): Promise<string> {
  const supabase = createSupabaseBrowser();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${carpeta}${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("productos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("productos").getPublicUrl(path);
  return data.publicUrl;
}

/** Foto de producto. */
export function subirImagenProducto(file: File): Promise<string> {
  return subirA(file);
}

/** Portada de categoría. */
export function subirImagenCategoria(file: File): Promise<string> {
  return subirA(file, "categorias/");
}
