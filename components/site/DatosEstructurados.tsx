import { NEGOCIO, SITE_DESCRIPTION, SITE_NAME, SITE_URL, urlAbsoluta } from "@/lib/site";
import type { Producto } from "@/lib/types";

/**
 * Datos estructurados (schema.org) para que Google entienda qué es esto y
 * pueda mostrar precio y disponibilidad directamente en los resultados.
 *
 * Solo declaramos lo que sabemos con certeza: no hay dirección ni horarios
 * porque no los tenemos, e inventarlos sería peor que omitirlos.
 */
function Json({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function NegocioJsonLd() {
  return (
    <Json
      data={{
        "@context": "https://schema.org",
        "@type": "Store",
        "@id": `${SITE_URL}/#negocio`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        telephone: NEGOCIO.telefono,
        image: urlAbsoluta("/opengraph-image"),
        sameAs: [NEGOCIO.instagram],
        address: {
          "@type": "PostalAddress",
          addressRegion: NEGOCIO.provincia,
          addressCountry: NEGOCIO.pais,
        },
        areaServed: { "@type": "Country", name: NEGOCIO.zonaDeVenta },
        currenciesAccepted: "ARS",
      }}
    />
  );
}

export function ProductoJsonLd({ producto }: { producto: Producto }) {
  return (
    <Json
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: producto.nombre,
        description: producto.descripcion ?? SITE_DESCRIPTION,
        category: producto.categoria.nombre,
        image: producto.imagenes.length > 0 ? producto.imagenes : [urlAbsoluta(`/productos/${producto.slug}/opengraph-image`)],
        offers: {
          "@type": "Offer",
          price: producto.precio_ars,
          priceCurrency: "ARS",
          // Se trabaja a pedido, no con stock: PreOrder es lo que corresponde.
          availability: "https://schema.org/PreOrder",
          url: urlAbsoluta(`/productos/${producto.slug}`),
          seller: { "@id": `${SITE_URL}/#negocio` },
        },
        ...(producto.specs.length > 0 && {
          additionalProperty: producto.specs.map((s) => ({
            "@type": "PropertyValue",
            name: s.label,
            value: s.value,
          })),
        }),
      }}
    />
  );
}

export function PreguntasJsonLd({ preguntas }: { preguntas: { p: string; r: string }[] }) {
  return (
    <Json
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: preguntas.map(({ p, r }) => ({
          "@type": "Question",
          name: p,
          acceptedAnswer: { "@type": "Answer", text: r },
        })),
      }}
    />
  );
}
