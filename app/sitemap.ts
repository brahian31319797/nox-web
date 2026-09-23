import type { MetadataRoute } from "next";
import { getProductosPublicados } from "@/lib/productos";
import { SITE_URL } from "@/lib/site";

/**
 * Se regenera en cada build y cuando se revalida el catálogo, así un producto
 * nuevo aparece sin esperar a que Google lo descubra solo.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fijas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/productos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/preguntas-frecuentes`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productos = await getProductosPublicados();
  const fichas: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${SITE_URL}/productos/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...fijas, ...fichas];
}
