import { NEGOCIO, SITE_DESCRIPTION, SITE_NAME, SITE_URL, urlAbsoluta } from "@/lib/site";
import type { Producto } from "@/lib/types";

/**
 * Datos estructurados (schema.org) para que Google entienda qué es esto y
 * pueda mostrar precio y disponibilidad directamente en los resultados.
 *
 * Solo declaramos lo que sabemos con certeza: no hay dirección ni horarios
 * porque no los tenemos, e inventarlos sería peor que omitirlos.
 */

/**
 * Caracteres que hay que neutralizar antes de meter JSON dentro de un <script>.
 *
 * JSON.stringify escapa comillas pero NO escapa "<". Un nombre de producto que
 * contenga "</script>" cierra la etiqueta y todo lo que siga se interpreta
 * como HTML de la página: eso es un XSS que se ejecuta en el navegador de
 * cualquiera que abra la ficha, aunque el dato lo haya cargado el admin.
 *
 * \u2028 y \u2029 son saltos de línea que JSON permite pero JavaScript no:
 * sin escaparlos, el navegador puede romper el parseo del bloque.
 */
const PELIGROSOS: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

function Json({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (c) => PELIGROSOS[c]);

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
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
          addressLocality: NEGOCIO.ciudad,
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
