"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { BoltIcon, MenuIcon, WhatsAppIcon, XIcon } from "@/components/site/icons";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--canvas)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-4 px-5">
          <Link href="/" className="flex items-center gap-2.5 font-display text-[17px] font-extrabold tracking-tight">
            <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] bg-[var(--accent)] text-[var(--accent-ink)]">
              <BoltIcon className="h-4 w-4" />
            </span>
            <span>
              Brahian González
              <span className="mt-0.5 block font-mono text-[9.5px] font-normal uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                Movilidad Eléctrica
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden gap-1 md:flex">
            {LINKS.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-3.5 py-2 text-[14.5px] font-semibold transition-colors ${
                    active ? "bg-[var(--surface-2)] text-[var(--ink)]" : "text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <a
            href={buildGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-bold text-[var(--canvas)] md:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            className="ml-auto grid h-10 w-10 place-items-center rounded-[10px] border border-[var(--line)] text-[var(--ink)] md:hidden"
            aria-label="Menú"
            onClick={() => setOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Drawer mobile */}
      <div
        className={`fixed inset-0 z-[70] bg-[var(--canvas)] transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-11 items-center justify-between px-5 pt-5">
          <span className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[var(--accent)] text-[var(--accent-ink)]">
              <BoltIcon className="h-4 w-4" />
            </span>
            Brahian González
          </span>
          <button
            className="grid h-10 w-10 place-items-center rounded-[10px] border border-[var(--line)]"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col px-5 pt-4">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-[var(--line)] py-3.5 font-display text-[28px] font-extrabold last:border-none"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={buildGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="py-3.5 font-display text-[28px] font-extrabold text-[var(--accent-2)]"
          >
            WhatsApp →
          </a>
        </nav>
      </div>
    </>
  );
}
