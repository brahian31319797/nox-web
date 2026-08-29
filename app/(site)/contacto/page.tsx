import { Benefits } from "@/components/site/Benefits";
import { InstagramIcon, WhatsAppIcon } from "@/components/site/icons";
import { buildGeneralWhatsAppUrl, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const metadata = {
  title: "Contacto — Brahian González",
};

function formatearNumero(numero: string) {
  // 5493755649384 -> +54 9 3755 64-9384
  const m = numero.match(/^54(9)(\d{4})(\d{2})(\d{4})$/);
  if (!m) return numero;
  return `+54 ${m[1]} ${m[2]} ${m[3]}-${m[4]}`;
}

export default function ContactoPage() {
  return (
    <main>
      <section className="px-5 py-14">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto mb-8 max-w-[640px] text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
              Estamos para ayudarte
            </span>
            <h1 className="mt-3.5 text-[clamp(30px,5vw,48px)]">Hablemos</h1>
            <p className="mt-3.5 text-base text-[var(--ink-soft)]">
              La forma más rápida es por WhatsApp: te respondemos las consultas, coordinamos el envío y la entrega.
              También podés seguirnos en Instagram para ver novedades y stock.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-[30px]">
              <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-[var(--accent)] text-[var(--accent-ink)]">
                <WhatsAppIcon className="h-[26px] w-[26px]" />
              </div>
              <div>
                <h3 className="text-[22px]">WhatsApp</h3>
                <p className="text-[14.5px] text-[var(--ink-soft)]">Respuesta rápida, de lun a sáb</p>
                <div className="mt-0.5 font-mono text-[15px]">{formatearNumero(WHATSAPP_NUMBER)}</div>
              </div>
              <a
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[var(--accent)] px-[22px] py-[13px] text-[15px] font-bold text-[var(--accent-ink)]"
              >
                Escribir ahora
              </a>
            </div>

            <div className="flex flex-col gap-4 rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-[30px]">
              <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-[var(--surface-3)] text-[var(--ink)]">
                <InstagramIcon className="h-[26px] w-[26px]" />
              </div>
              <div>
                <h3 className="text-[22px]">Instagram</h3>
                <p className="text-[14.5px] text-[var(--ink-soft)]">Novedades, stock y clientes reales</p>
                <div className="mt-0.5 font-mono text-[15px]">@{INSTAGRAM_HANDLE}</div>
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-[var(--line)] px-[22px] py-[13px] text-[15px] font-bold text-[var(--ink)]"
              >
                Ver perfil
              </a>
            </div>
          </div>
        </div>
      </section>

      <Benefits />
    </main>
  );
}
