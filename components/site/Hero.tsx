import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/site/icons";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)]">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Monopatín eléctrico Brahian González"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "0% 77%" }}
        />
      </div>
      {/* Velo plano y parejo (sin degradado) para que el texto se lea siempre */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative mx-auto flex min-h-[clamp(460px,66vh,620px)] max-w-[1180px] items-center px-5 py-14">
        <div className="max-w-[600px]">
          <h1 className="text-[clamp(40px,6.4vw,68px)] font-extrabold tracking-tight text-[var(--ink)]">
            La ciudad es tuya. <em className="not-italic text-[var(--accent)]">Movete eléctrico.</em>
          </h1>
          <p className="my-5 max-w-[42ch] text-[clamp(15px,1.6vw,18px)] text-[var(--ink-soft)]">
            Monopatines, motos y bicicletas eléctricas con envío a todo el país.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-[22px] py-[13px] text-[15px] font-bold text-[var(--accent-ink)] transition-transform hover:-translate-y-0.5"
            >
              Ver productos
              <ArrowRightIcon className="h-[18px] w-[18px]" />
            </Link>
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-[22px] py-[13px] text-[15px] font-bold text-[var(--canvas)] transition-transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              Consultar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
