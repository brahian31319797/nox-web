import { z } from "zod";

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
  specs: z.array(specSchema).default([]),
  imagenes: z.array(z.string().url()).default([]),
  publicado: z.coerce.boolean().default(true),
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
