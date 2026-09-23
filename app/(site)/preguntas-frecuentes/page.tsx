import Link from "next/link";
import { PreguntasJsonLd } from "@/components/site/DatosEstructurados";
import { WhatsAppIcon } from "@/components/site/icons";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { NEGOCIO } from "@/lib/site";

export const metadata = {
  title: "Preguntas frecuentes",
  description:
    "Cómo se paga, cuánto sale el envío, qué garantía tienen los vehículos y qué pasa si se rompe. Respuestas claras, sin letra chica.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

/**
 * Todas las respuestas salen de datos confirmados con Brahian (garantía de 3
 * meses, envío a cargo del cliente salvo en Oberá, medios de pago, sin
 * servicio técnico fuera de garantía). Lo que no sabemos con certeza —la
 * normativa de cada municipio— se dice que no lo sabemos, en vez de arriesgar
 * una respuesta que después le explote a un cliente en la cara.
 *
 * El texto también alimenta el bloque FAQPage de schema.org, así que cambiar
 * una respuesta acá actualiza lo que muestra Google.
 */
const PREGUNTAS = [
  {
    p: "¿Cómo se paga?",
    r: `Reservás con el 50% y pagás el resto cuando lo recibís y lo probaste. Acepto transferencia bancaria, efectivo, dólares billete y USDT. No arriesgás toda la plata de una: esa es la idea.`,
  },
  {
    p: "¿El envío está incluido en el precio?",
    r: `No. El precio que ves es el del vehículo; el envío se cotiza aparte según tu ciudad y queda a tu cargo. La excepción es ${NEGOCIO.envioSinCargo}: ahí te lo llevo a domicilio sin costo. Escribime con tu ciudad y te paso el número antes de que pagues nada.`,
  },
  {
    p: "¿Qué garantía tienen?",
    r: `${NEGOCIO.garantiaMeses} meses por fallas de fábrica. No cubre golpes, mal uso, ni el desgaste normal de la batería con el tiempo. Si algo falla dentro de ese plazo, escribime y lo resolvemos.`,
  },
  {
    p: "¿Y si se rompe después de la garantía?",
    r: `Te lo digo de frente: pasados los ${NEGOCIO.garantiaMeses} meses no tengo servicio técnico propio. Prefiero que lo sepas antes de comprar y no después. Si te pasa algo, escribime igual y vemos qué se puede hacer, pero no te voy a prometer algo que no puedo cumplir.`,
  },
  {
    p: "¿Cuánto tarda en llegar?",
    r: `Depende del modelo: trabajo a pedido, así que el plazo figura en cada ficha de producto. Antes de que pagues, te confirmo el tiempo real para tu caso.`,
  },
  {
    p: "¿Necesito licencia o patente?",
    r: `Depende de dónde vivas: la normativa de monopatines y motos eléctricas la define cada municipio y cambia bastante de una ciudad a otra. No te puedo dar una respuesta que sirva para todos. Averiguá en tu municipio antes de comprar, y si querés escribime y lo vemos juntos.`,
  },
  {
    p: "¿Cuánta autonomía tiene cada modelo?",
    r: `Está en la ficha técnica de cada producto, junto con la potencia y la velocidad máxima. Son los números del fabricante: en la calle varían según tu peso, la pendiente y cómo manejes. Si me contás cuántos kilómetros hacés por día, te digo cuál te alcanza de verdad.`,
  },
  {
    p: "¿Puedo verlo antes de comprar?",
    r: `Si estás en ${NEGOCIO.ciudad} o cerca, coordinamos y lo ves. Si estás lejos, te mando fotos y videos reales del modelo que te interesa, no las de catálogo.`,
  },
];

export default function PreguntasFrecuentesPage() {
  return (
    <main className="mx-auto max-w-[760px] px-5 pb-20 pt-10 md:pt-14">
      <PreguntasJsonLd preguntas={PREGUNTAS} />

      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
        Sin letra chica
      </span>
      <h1 className="mt-3 text-[clamp(30px,5vw,46px)]">Preguntas frecuentes</h1>
      <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--ink-soft)]">
        Lo que más me preguntan, respondido de una. Si te queda alguna duda, escribime.
      </p>

      <div className="mt-9 overflow-hidden rounded-[16px] border border-[var(--line)]">
        {PREGUNTAS.map(({ p, r }) => (
          <details key={p} className="group border-b border-[var(--line)] last:border-b-0 open:bg-[var(--surface)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15.5px] font-bold [&::-webkit-details-marker]:hidden">
              {p}
              <span
                aria-hidden
                className="grid h-7 w-7 flex-none place-items-center rounded-full border border-[var(--line)] text-[var(--ink-soft)] transition-transform group-open:rotate-45 group-open:border-[var(--accent)] group-open:text-[var(--accent-2)]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-3.5 w-3.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">{r}</p>
          </details>
        ))}
      </div>

      <div className="mt-8 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-6 text-center">
        <h2 className="text-[20px]">¿Te quedó alguna duda?</h2>
        <p className="mx-auto mt-2 max-w-[42ch] text-[14.5px] text-[var(--ink-soft)]">
          Escribime y te la saco. Si el modelo que estás mirando no te sirve, también te lo voy a decir.
        </p>
        <a
          href={buildGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-[22px] py-[13px] text-[15px] font-bold text-[var(--accent-ink)]"
        >
          <WhatsAppIcon className="h-[18px] w-[18px]" />
          Escribirme por WhatsApp
        </a>
        <div className="mt-4">
          <Link href="/productos" className="text-[14px] font-bold text-[var(--accent-2)]">
            Ver los modelos →
          </Link>
        </div>
      </div>
    </main>
  );
}
