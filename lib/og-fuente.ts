/**
 * Archivo (la tipografía de los títulos) para las imágenes que se generan al
 * compartir un link. next/font no sirve acá: ImageResponse necesita el binario
 * de la fuente, no una clase CSS.
 *
 * Si Google Fonts no responde devolvemos null y la imagen se dibuja con la
 * tipografía del sistema: preferimos una vista previa menos linda antes que
 * una ruta que falla y deja el link sin imagen.
 */
export async function cargarArchivo(peso: 700 | 900): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Archivo:wght@${peso}`, {
      // Sin un User-Agent de navegador, Google responde con woff2, que
      // ImageResponse no puede leer.
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      next: { revalidate: 86400 },
    }).then((r) => r.text());

    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;

    const res = await fetch(url, { next: { revalidate: 86400 } });
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}
