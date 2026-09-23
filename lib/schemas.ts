import { z } from "zod";

/**
 * Las imágenes solo pueden venir del storage del propio proyecto.
 *
 * Sin esta restricción, `imagenes` aceptaba cualquier URL, y esa URL después
 * la descarga el servidor al generar la vista previa del producto: aceptar
 * hosts arbitrarios convierte esa ruta en un trampolín para pedirle cosas a
 * direcciones internas (SSRF). Además evita incrustar imágenes de terceros que
 * podrían caerse o cambiar sin aviso.
 */
const HOST_STORAGE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : "";

export const urlImagenSchema = z
  .string()
  .url("La dirección de la imagen no es válida")
  .refine((valor) => {
    try {
      const url = new URL(valor);
      if (url.protocol !== "https:") return false;
      // Sin proyecto configurado (desarrollo local) no hay host contra el cual
      // comparar; ahí alcanza con exigir https.
      return HOST_STORAGE === "" || url.host === HOST_STORAGE;
    } catch {
      return false;
    }
  }, "La imagen tiene que estar subida al storage del sitio");

export const specSchema = z.object({
  label: z.string().trim().min(1, "Falta el nombre de la característica"),
  value: z.string().trim().min(1, "Falta el valor"),
});

export const productoSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  categoria_id: z.string().uuid("Elegí una categoría"),
  etiqueta: z.string().trim().max(40).nullable().optional(),
  descripcion: z.string().trim().max(600).nullable().optional(),
  precio_ars: z.coerce.number().min(0, "El precio no puede ser negativo"),
  precio_usd: z.coerce.number().min(0, "El precio no puede ser negativo"),
  specs: z.array(specSchema).max(40, "Son demasiadas características").default([]),
  imagenes: z.array(urlImagenSchema).max(12, "Son demasiadas fotos").default([]),
  publicado: z.coerce.boolean().default(true),
  destacado: z.coerce.boolean().default(false),
  entrega: z.string().trim().max(60).nullable().optional(),
});

export type ProductoFormValues = z.infer<typeof productoSchema>;

export const categoriaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
});

/** Convierte "ZAROS L8 Max" en "zaros-l8-max" para sugerir el slug. */
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // saca tildes (á -> a + marca combinada)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
