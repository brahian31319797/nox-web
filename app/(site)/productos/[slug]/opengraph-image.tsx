import { ImageResponse } from "next/og";
import sharp from "sharp";
import { cargarArchivo } from "@/lib/og-fuente";
import { OgLogoMark } from "@/lib/og-logo";
import { getProductoBySlug } from "@/lib/productos";
import { fmtArs } from "@/lib/format";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
const ANCHO_FOTO = 480;

/**
 * El generador de imágenes de Next no lee WebP, que es justo el formato en que
 * se suben las fotos al bucket. Las convertimos a JPEG con sharp y las
 * incrustamos, si no el panel de la foto sale vacío.
 */
async function fotoIncrustada(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(ANCHO_FOTO, size.height, { fit: "cover" })
      .jpeg({ quality: 82 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}
export const contentType = "image/png";
export const alt = "Ficha de producto";

/**
 * Vista previa del producto al pasar el link por WhatsApp: foto, nombre y
 * precio. Es lo primero que ve alguien a quien le recomiendan un modelo.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [producto, archivo] = await Promise.all([getProductoBySlug(slug), cargarArchivo(900)]);
  const fuente = archivo ? "Archivo" : "sans-serif";

  if (!producto) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0b",
            color: "#f5f4f1",
            fontSize: 48,
            fontFamily: fuente,
          }}
        >
          {SITE_NAME}
        </div>
      ),
      { ...size, fonts: archivo ? [{ name: "Archivo", data: archivo, weight: 900, style: "normal" }] : [] }
    );
  }

  const foto = producto.imagenes[0] ? await fotoIncrustada(producto.imagenes[0]) : null;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0b", fontFamily: fuente }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 56px",
          }}
        >
          <span style={{ color: "#ff8a3d", fontSize: 24, letterSpacing: 3, textTransform: "uppercase" }}>
            {producto.categoria.nombre}
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span
              style={{
                color: "#f5f4f1",
                fontSize: producto.nombre.length > 34 ? 52 : 68,
                fontWeight: 900,
                lineHeight: 1.05,
              }}
            >
              {producto.nombre}
            </span>
            <span style={{ color: "#3ed598", fontSize: 56, fontWeight: 900 }}>
              {fmtArs(producto.precio_ars)}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <OgLogoMark size={52} />
            <span style={{ color: "#a8a6a1", fontSize: 24 }}>{SITE_NAME}</span>
          </div>
        </div>

        {/* Sin foto cargada mostramos la franja de marca en vez de un hueco. */}
        <div
          style={{
            width: ANCHO_FOTO,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: foto ? "#151517" : "#0e0e10",
          }}
        >
          {foto ? (
            <img src={foto} alt="" width={ANCHO_FOTO} height={size.height} style={{ objectFit: "cover" }} />
          ) : (
            <OgLogoMark size={230} />
          )}
        </div>
      </div>
    ),
    { ...size, fonts: archivo ? [{ name: "Archivo", data: archivo, weight: 900, style: "normal" }] : [] }
  );
}
