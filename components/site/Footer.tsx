import Link from "next/link";
import { BoltIcon, InstagramIcon } from "@/components/site/icons";
import { buildGeneralWhatsAppUrl, INSTAGRAM_URL } from "@/lib/whatsapp";

const CATEGORIAS = [
  { slug: "monopatin", nombre: "Monopatines" },
  { slug: "moto", nombre: "Motos Eléctricas" },
  { slug: "bici", nombre: "Bicicletas Eléctricas" },
];

export function Footer() {
  return (
    <footer className="mt-5 border-t border-[var(--line)] px-5 py-11">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-start justify-between gap-6">
        <div className="max-w-[34ch]">
          <Link href="/" className="flex items-center gap-2.5 font-display text-[17px] font-extrabold">
            <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-[var(--accent)] text-[var(--accent-ink)]">
              <BoltIcon className="h-4 w-4" />
            </span>
            Brahian González
          </Link>
          <p className="mt-3 text-[13.5px] text-[var(--ink-soft)]">
            Monopatines, motos y bicicletas eléctricas con envío a todo el país. Comprá con respaldo y atención
            directa.
          </p>
        </div>

        <div className="flex flex-wrap gap-14">
          <div>
            <h5 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              Navegación
            </h5>
            <Link href="/" className="block py-1 text-sm text-[var(--ink-soft)] hover:text-[var(--accent-2)]">
              Inicio
            </Link>
            <Link href="/productos" className="block py-1 text-sm text-[var(--ink-soft)] hover:text-[var(--accent-2)]">
              Productos
            </Link>
            <Link href="/contacto" className="block py-1 text-sm text-[var(--ink-soft)] hover:text-[var(--accent-2)]">
              Contacto
            </Link>
          </div>
          <div>
            <h5 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              Categorías
            </h5>
            {CATEGORIAS.map((c) => (
              <Link
                key={c.slug}
                href={`/productos?categoria=${c.slug}`}
                className="block py-1 text-sm text-[var(--ink-soft)] hover:text-[var(--accent-2)]"
              >
                {c.nombre}
              </Link>
            ))}
          </div>
          <div>
            <h5 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              Contacto
            </h5>
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-1 text-sm text-[var(--ink-soft)] hover:text-[var(--accent-2)]"
            >
              WhatsApp
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-1 text-sm text-[var(--ink-soft)] hover:text-[var(--accent-2)]"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-9 flex max-w-[1180px] flex-wrap justify-between gap-4 border-t border-[var(--line)] pt-5 font-mono text-[12.5px] text-[var(--ink-faint)]">
        <span>© {new Date().getFullYear()} Brahian González</span>
      </div>
    </footer>
  );
}
