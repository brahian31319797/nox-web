/**
 * El isotipo (BG + franjas) para las imágenes que se generan al compartir un
 * link. Replica la geometría de components/brand/LogoMark sobre la misma
 * grilla de 64: el generador de imágenes no puede usar ese componente porque
 * dibuja las letras con <text> y una variable CSS de fuente, que acá no existen.
 * Las letras van como texto HTML con la fuente Archivo que ya carga cada imagen,
 * y las franjas como SVG encima.
 */
export function OgLogoMark({ size }: { size: number }) {
  const u = size / 64;
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: size,
        height: size,
        borderRadius: 15 * u,
        background: "#151517",
        border: `${Math.max(1, 1.2 * u)}px solid #2f2f34`,
      }}
    >
      {/* Centrado en x=27 de 64, igual que el logo: deja lugar a las franjas. */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 0,
          top: 0,
          width: 54 * u,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          color: "#f5f4f1",
          fontSize: 25 * u,
          fontWeight: 900,
          letterSpacing: -1.2 * u,
        }}
      >
        BG
      </div>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <path d="M48 13 L56 13 L44 51 L36 51 Z" fill="#ff5a1f" />
        <path d="M58 24 L63 24 L55 51 L50 51 Z" fill="rgba(255,90,31,0.5)" />
      </svg>
    </div>
  );
}
