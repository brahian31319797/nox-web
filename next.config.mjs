/** @type {import('next').NextConfig} */

// Se completa solo cuando exista NEXT_PUBLIC_SUPABASE_URL (ver .env.local).
// Hasta entonces el sitio funciona con los datos de referencia en lib/seed-data.ts.
const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : "";

const securityHeaders = [
  // Evita que la página se muestre en iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Evita que el browser "adivine" el MIME type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controla cuánta info de referrer se comparte
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Fuerza HTTPS por 2 años (solo activo en producción con dominio real)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Deshabilita features del navegador que no se usan
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js necesita inline scripts para hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Tailwind genera estilos inline; Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      // Imágenes propias + Supabase Storage + data URIs para íconos SVG inline
      `img-src 'self' data: blob:${SUPABASE_HOST ? ` https://${SUPABASE_HOST}` : ""}`,
      // Fetch a Supabase (auth + datos)
      `connect-src 'self'${SUPABASE_HOST ? ` https://${SUPABASE_HOST} wss://${SUPABASE_HOST}` : ""}`,
    ].join("; "),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: SUPABASE_HOST
      ? [{ protocol: "https", hostname: SUPABASE_HOST, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;
