"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertIcon, LockIcon, UserIcon } from "@/components/admin/icons";
import { BoltIcon, ArrowRightIcon } from "@/components/site/icons";
import { createSupabaseBrowser } from "@/lib/supabase";

const SUPABASE_CONFIGURADO = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Usuario o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push(searchParams.get("redirect") || "/admin/productos");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--canvas)] p-5">
      <div className="w-full max-w-[380px] rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-lg">
        <div className="mb-7 flex items-center gap-2.5">
          <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[10px] bg-[var(--accent)] text-[var(--accent-ink)]">
            <BoltIcon className="h-[18px] w-[18px]" />
          </span>
          <div>
            <b className="block font-display text-base font-extrabold">Brahian González</b>
            <span className="block font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              Panel de administración
            </span>
          </div>
        </div>

        <h1 className="mb-1.5 text-2xl">Iniciar sesión</h1>

        {!SUPABASE_CONFIGURADO ? (
          <div className="mt-4 flex gap-2.5 rounded-[11px] border border-[rgba(255,93,108,0.35)] bg-[var(--danger-soft)] p-3.5 text-[13px] text-[var(--danger)]">
            <AlertIcon className="h-4 w-4 flex-none" />
            <p>
              Todavía no conectamos Supabase (falta <code className="font-mono">.env.local</code>). El panel se
              habilita ni bien tengamos el proyecto creado.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-[13.5px] text-[var(--ink-soft)]">
              Ingresá para gestionar tus productos y categorías.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-1.5 block text-[12.5px] font-semibold text-[var(--ink-soft)]">Email</label>
                <div className="flex h-[46px] items-center gap-2.5 rounded-[10px] border-[1.5px] border-[var(--line)] bg-[var(--surface-2)] px-3.5 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_rgba(255,90,31,.15)]">
                  <UserIcon className="h-4 w-4 flex-none text-[var(--ink-faint)]" />
                  <input
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="h-full w-full bg-transparent text-[14.5px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="mb-1.5 block text-[12.5px] font-semibold text-[var(--ink-soft)]">Contraseña</label>
                <div className="flex h-[46px] items-center gap-2.5 rounded-[10px] border-[1.5px] border-[var(--line)] bg-[var(--surface-2)] px-3.5 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_rgba(255,90,31,.15)]">
                  <LockIcon className="h-4 w-4 flex-none text-[var(--ink-faint)]" />
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="h-full w-full bg-transparent text-[14.5px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
                  />
                </div>
              </div>

              {error && <p className="mb-4 text-[13px] text-[var(--danger)]">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--accent)] py-3 text-[14.5px] font-bold text-[var(--accent-ink)] disabled:opacity-60"
              >
                {loading ? "Ingresando…" : "Ingresar"}
                <ArrowRightIcon className="h-[18px] w-[18px]" />
              </button>
            </form>
          </>
        )}

        <div className="mt-[18px] text-center font-mono text-[11px] text-[var(--ink-faint)]">
          Acceso privado · solo para el administrador
        </div>
      </div>
    </div>
  );
}
