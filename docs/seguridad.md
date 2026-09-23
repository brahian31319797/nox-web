# Seguridad — estado y pendientes

Última revisión: 22 de septiembre de 2026

## Qué defiende cada capa

| Capa | Qué cubre |
|---|---|
| **Middleware** (`middleware.ts`) | Navegación a `/admin/*`: sin sesión o sin rol admin, redirige. **No protege las server actions**, que son endpoints POST invocables directamente. |
| **Guard de acciones** (`lib/actions/guard.ts`) | Toda server action empieza por `autorizarAdmin()`: valida sesión contra Supabase (`getUser`, no `getSession`) y rol `admin` en `profiles`. |
| **RLS** (`supabase/schema.sql`) | Última barrera en la base. Lectura pública solo de productos publicados; escritura solo con rol admin. Verificada con la clave anónima: no lee ocultos, no lee `profiles`, no inserta. |
| **Validación** (`lib/schemas.ts`) | Zod en todo lo que entra. Las URLs de imagen solo pueden apuntar al storage del propio proyecto. |
| **Headers** (`next.config.mjs`) | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. |

## Decisiones que conviene no revertir

- **`getUser()` y no `getSession()`** en el guard y el middleware. `getSession()` lee la cookie sin validarla contra Supabase, y esa cookie la manda el cliente.
- **Los errores de Postgres no se devuelven al cliente.** `errorPublicable()` los reemplaza por un mensaje genérico y deja el detalle en los logs del servidor: los mensajes de la base nombran columnas, constraints e índices.
- **El JSON-LD se escapa antes de inyectarse** (`components/site/DatosEstructurados.tsx`). `JSON.stringify` no escapa `<`, así que un nombre de producto con `</script>` cerraba la etiqueta e inyectaba HTML en la ficha pública. Está verificado con un payload real.
- **El nombre de los archivos subidos lo genera el servidor** (`crypto.randomUUID`), no el usuario: usar el nombre original dejaría elegir la ruta dentro del bucket.
- **No se aceptan SVG** en las subidas: pueden traer scripts adentro.

## Pendiente: rate limiting

Es lo único que no se puede resolver solo con código de la app, porque el login va del navegador directo a Supabase Auth.

### Paso 1 — Protección de Supabase Auth (hacer ya, sin código)

En el panel de Supabase:

1. **Authentication → Attack Protection**
   - Activar **CAPTCHA** (hCaptcha o Cloudflare Turnstile). Requiere agregar el widget en `app/admin/login/page.tsx` con la site key.
   - Activar **Leaked password protection**.
2. **Authentication → Rate Limits**
   - Bajar el límite de `Token refresh` y `Sign in / Sign up` a algo cercano a **5 intentos cada 15 minutos por IP**.

### Paso 2 — Rate limit de la app (opcional, cuando haga falta)

Para las server actions, con `@upstash/ratelimit` + Upstash Redis (tiene plan gratuito):

```bash
npm install @upstash/ratelimit @upstash/redis
```

Variables nuevas en Vercel: `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`.
El límite se aplica dentro de `autorizarAdmin()`, que ya es el único punto de entrada de todas las acciones.

> No se implementó un rate limit en memoria porque en Vercel cada instancia tiene la suya: daría una sensación de protección que no existe.

## Pendiente: CSP más estricta

`script-src` incluye `'unsafe-inline'` y `'unsafe-eval'` porque Next.js los necesita. La versión estricta usa nonces por request, se configura en el middleware y hay que probarla bien. Con el XSS del JSON-LD ya cerrado, el riesgo residual es bajo.
