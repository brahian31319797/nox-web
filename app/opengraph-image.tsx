import { ImageResponse } from "next/og";
import { cargarArchivo } from "@/lib/og-fuente";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} — Monopatines, motos y bicis eléctricas`;

/** Vista previa por defecto del sitio al compartirlo por WhatsApp o redes. */
export default async function Image() {
  const archivo = await cargarArchivo(900);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: "72px 80px",
          fontFamily: archivo ? "Archivo" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 76,
              height: 76,
              borderRadius: 18,
              background: "#151517",
              border: "2px solid #2f2f34",
              alignItems: "center",
              justifyContent: "center",
              color: "#f5f4f1",
              fontSize: 30,
              fontWeight: 900,
            }}
          >
            BG
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#f5f4f1", fontSize: 30, fontWeight: 900 }}>{SITE_NAME}</span>
            <span style={{ color: "#6e6c67", fontSize: 18, letterSpacing: 3 }}>MOVILIDAD ELÉCTRICA</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#f5f4f1", fontSize: 96, fontWeight: 900, lineHeight: 1.02 }}>
            Dejá de pagar
          </span>
          <span style={{ color: "#ff5a1f", fontSize: 96, fontWeight: 900, lineHeight: 1.02 }}>
            por moverte.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              display: "flex",
              background: "#0f2a20",
              border: "2px solid #1d4a39",
              color: "#3ed598",
              fontSize: 24,
              fontWeight: 700,
              padding: "14px 24px",
              borderRadius: 999,
            }}
          >
            Con financiación
          </span>
          <span style={{ color: "#a8a6a1", fontSize: 24 }}>Envío a todo el país</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: archivo ? [{ name: "Archivo", data: archivo, weight: 900, style: "normal" }] : [],
    }
  );
}
