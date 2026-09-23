import { createSupabaseBrowser } from "./supabase";

/** Tipos que el sitio sabe mostrar. Un SVG podría traer scripts adentro. */
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** 8 MB: una foto de celular entra cómoda y no llena el storage de golpe. */
const TAMANO_MAXIMO = 8 * 1024 * 1024;

/** Extensión derivada del tipo real, no del nombre que trae el archivo. */
const EXTENSIONES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export class ArchivoInvalido extends Error {}

/**
 * Sube una imagen al bucket público "productos" y devuelve su URL pública.
 *
 * `carpeta` separa las portadas de categoría de las fotos de producto sin
 * necesidad de un bucket aparte: las políticas de acceso del bucket ya están
 * puestas y probadas, duplicarlas solo agrega superficie para equivocarse.
 *
 * Validar acá es comodidad para quien carga, no seguridad: el navegador es del
 * usuario y cualquiera puede saltear esta función. La barrera real es la
 * política del bucket, que exige rol admin para escribir.
 */
async function subirA(file: File, carpeta = ""): Promise<string> {
  if (!TIPOS_PERMITIDOS.includes(file.type)) {
    throw new ArchivoInvalido("Tiene que ser una imagen JPG, PNG, WEBP o AVIF.");
  }
  if (file.size > TAMANO_MAXIMO) {
    throw new ArchivoInvalido("La imagen no puede pesar más de 8 MB.");
  }

  const supabase = createSupabaseBrowser();
  // El nombre lo generamos nosotros: usar el del archivo dejaría que el
  // usuario elija la ruta dentro del bucket.
  const path = `${carpeta}${crypto.randomUUID()}.${EXTENSIONES[file.type]}`;

  const { error } = await supabase.storage.from("productos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
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
