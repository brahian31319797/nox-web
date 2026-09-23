import { WhatsAppIcon } from "@/components/site/icons";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={buildGeneralWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-4 right-4 z-[60] grid h-14 w-14 place-items-center rounded-full shadow-[0_12px_28px_-8px_rgba(0,0,0,.45)] md:hidden"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
