import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton para evitar perder la sesión entre renders del panel admin.
let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createSupabaseBrowser() {
  if (browserClient) return browserClient;
  browserClient = createBrowserClient(url, anon);
  return browserClient;
}
