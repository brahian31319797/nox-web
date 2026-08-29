"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { BoltIcon } from "@/components/site/icons";
import { ExternalLinkIcon, GridIcon, ListIcon, LogOutIcon } from "@/components/admin/icons";
import { createSupabaseBrowser } from "@/lib/supabase";

const NAV = [
  { href: "/admin/productos", label: "Productos", icon: GridIcon },
  { href: "/admin/categorias", label: "Categorías", icon: ListIcon },
];

export function AdminShell({
  email,
  productCount,
  children,
}: {
  email: string;
  productCount: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      {/* Topbar mobile */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-[var(--accent)] text-[var(--accent-ink)]">
            <BoltIcon className="h-[15px] w-[15px]" />
          </span>
          <b className="font-display text-sm font-extrabold">Brahian González</b>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Menú"
          className="grid h-[38px] w-[38px] flex-none place-items-center rounded-[10px] border border-[var(--line)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[18px] w-[18px]">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Scrim mobile */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[74] bg-[rgba(6,6,7,.6)] backdrop-blur-[2px] transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar (fija en desktop, drawer en mobile) */}
      <aside
        className={`fixed top-0 left-0 z-[75] flex h-screen w-[82%] max-w-[300px] flex-col border-r border-[var(--line)] bg-[var(--surface)] p-3.5 transition-transform duration-300 ease-out md:sticky md:z-auto md:w-auto md:max-w-none md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 px-2 pb-[22px] pt-1.5">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-[9px] bg-[var(--accent)] text-[var(--accent-ink)]">
            <BoltIcon className="h-[17px] w-[17px]" />
          </span>
          <div>
            <b className="block font-display text-[14.5px] font-extrabold">Brahian González</b>
            <span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
              Panel admin
            </span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5">
          <span className="px-2.5 pb-1.5 pt-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Catálogo
          </span>
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 rounded-[9px] px-2.5 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "bg-[var(--accent-soft)] text-[var(--accent-2)]" : "text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                }`}
              >
                <item.icon className="h-[17px] w-[17px] flex-none" />
                {item.label}
                {item.href === "/admin/productos" && (
                  <span
                    className={`ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11px] ${
                      active ? "bg-[rgba(255,90,31,.14)] text-[var(--accent-2)]" : "bg-[var(--surface-3)] text-[var(--ink-faint)]"
                    }`}
                  >
                    {productCount}
                  </span>
                )}
              </Link>
            );
          })}

          <span className="px-2.5 pb-1.5 pt-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Sitio
          </span>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2.5 text-sm font-semibold text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
          >
            <ExternalLinkIcon className="h-[17px] w-[17px] flex-none" />
            Ver web pública
          </Link>
        </nav>

        <div className="mt-2.5 border-t border-[var(--line)] pt-3.5">
          <div className="flex items-center gap-2.5 px-2">
            <div className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[var(--surface-3)] font-display text-[13px] font-extrabold">
              {initials}
            </div>
            <div className="min-w-0">
              <b className="block truncate text-[13px]">{email}</b>
              <span className="block text-[11px] text-[var(--ink-faint)]">Administrador</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2.5 text-[13px] font-semibold text-[var(--ink-faint)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          >
            <LogOutIcon className="h-[15px] w-[15px]" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="px-4 py-6 md:px-8 md:py-7">{children}</main>
    </div>
  );
}
