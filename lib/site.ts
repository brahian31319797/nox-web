import { INSTAGRAM_URL, WHATSAPP_NUMBER } from "./whatsapp";

/**
 * URL pública del sitio. La necesitan el sitemap, las etiquetas canónicas y las
 * imágenes para compartir, que exigen direcciones absolutas.
 *
 * Orden: dominio propio si está configurado, si no el que Vercel asigna al
 * proyecto en producción, y en último caso localhost para desarrollo.
 * Cuando haya dominio definitivo, setear NEXT_PUBLIC_SITE_URL en Vercel.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const SITE_NAME = "Brahian González";

export const SITE_DESCRIPTION =
  "Dejá de pagar por moverte. Monopatines, motos y bicicletas eléctricas con envío a todo el país. Pagás 50% y el resto al recibir.";

/** Datos del negocio para los buscadores (schema.org). Solo lo que sabemos. */
export const NEGOCIO = {
  nombre: SITE_NAME,
  telefono: `+${WHATSAPP_NUMBER}`,
  instagram: INSTAGRAM_URL,
  provincia: "Misiones",
  pais: "AR",
  /** Vende a todo el país aunque opere desde Misiones. */
  zonaDeVenta: "Argentina",
} as const;

export function urlAbsoluta(ruta: string): string {
  return `${SITE_URL}${ruta.startsWith("/") ? ruta : `/${ruta}`}`;
}
