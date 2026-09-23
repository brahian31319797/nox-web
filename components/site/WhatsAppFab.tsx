import { WhatsAppIcon } from "@/components/site/icons";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Botón flotante de WhatsApp: es el cierre de venta de todo el sitio, así que
 * se mueve a propósito para que la vista vuelva a él.
 *
 * El halo va en un span aparte y no como sombra del botón porque una sombra
 * animada obliga al navegador a repintar en cada cuadro; así solo se compone
 * una capa y el scroll no se traba en celulares lentos.
 */
export function WhatsAppFab() {
  return (
    <a
      href={buildGeneralWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="wa-fab fixed bottom-4 right-4 z-[60] grid h-14 w-14 place-items-center rounded-full transition-transform md:hidden"
    >
      <span
        aria-hidden
        className="wa-halo pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
      />
      <WhatsAppIcon className="relative h-14 w-14 drop-shadow-[0_8px_20px_rgba(0,0,0,.45)]" />
    </a>
  );
}
