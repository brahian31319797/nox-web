import "server-only";

import { createSupabaseServer } from "@/lib/supabase-server";

/**
 * Autorización de las server actions del panel.
 *
 * Por qué existe: una server action es un endpoint POST que cualquiera puede
 * invocar. Hasta ahora la única defensa era RLS, que hoy funciona pero es una
 * sola capa: alcanza con que una migración futura desactive una policy para
 * que todas las escrituras queden abiertas. Esto agrega la segunda capa, del
 * lado de la app.
 *
 * El middleware NO sirve para esto: protege la navegación a /admin, no la
 * invocación directa de la action.
 */

export type Autorizado = {
  ok: true;
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>;
  userId: string;
};
export type Rechazado = { ok: false; error: string };

/** Mensaje único para el cliente: no revela si falló la sesión o el rol. */
const SIN_PERMISO = "No tenés permiso para hacer esto. Volvé a iniciar sesión.";

/**
 * Registra el rechazo en el servidor sin datos sensibles: nunca contraseñas,
 * tokens ni el contenido del payload. Solo qué se intentó y por qué se negó.
 */
function registrarRechazo(accion: string, motivo: string, userId?: string) {
  console.warn(
    `[seguridad] acción rechazada · accion=${accion} · motivo=${motivo}` +
      (userId ? ` · usuario=${userId}` : "")
  );
}

/**
 * Verifica que quien llama tenga sesión y rol admin.
 * Devuelve el cliente ya creado para no volver a construirlo en cada action.
 */
export async function autorizarAdmin(accion: string): Promise<Autorizado | Rechazado> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    registrarRechazo(accion, "supabase-sin-configurar");
    return { ok: false, error: "Supabase todavía no está conectado." };
  }

  const supabase = await createSupabaseServer();

  // getUser() valida el token contra Supabase. getSession() leería la cookie
  // sin verificarla, y esa cookie la manda el cliente.
  const {
    data: { user },
    error: errorAuth,
  } = await supabase.auth.getUser();

  if (errorAuth || !user) {
    registrarRechazo(accion, "sin-sesion");
    return { ok: false, error: SIN_PERMISO };
  }

  const { data: perfil, error: errorPerfil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (errorPerfil) {
    console.error(`[seguridad] no se pudo leer el perfil · accion=${accion}`, errorPerfil.message);
    return { ok: false, error: SIN_PERMISO };
  }

  if (perfil?.role !== "admin") {
    registrarRechazo(accion, "rol-insuficiente", user.id);
    return { ok: false, error: SIN_PERMISO };
  }

  return { ok: true, supabase, userId: user.id };
}

/**
 * Traduce un error de la base a algo publicable.
 *
 * Los mensajes de Postgres nombran columnas, constraints e índices: es
 * información gratis para alguien que esté tanteando el esquema. El detalle
 * queda en los logs del servidor.
 */
export function errorPublicable(accion: string, error: { code?: string; message: string }): string {
  console.error(`[seguridad] fallo en la base · accion=${accion} · code=${error.code ?? "?"}`, error.message);

  // El único caso que le sirve saber a quien está cargando datos.
  if (error.code === "23505") return "Ya existe un producto con ese slug.";

  return "No se pudo guardar el cambio. Probá de nuevo.";
}

/** Registra un input que no pasó la validación (posible intento de inyección). */
export function registrarInputInvalido(accion: string, detalle: string) {
  console.warn(`[seguridad] input rechazado · accion=${accion} · detalle=${detalle}`);
}
