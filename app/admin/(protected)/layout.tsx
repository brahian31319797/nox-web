import { AdminShell } from "@/components/admin/AdminShell";
import { getProductosAdmin } from "@/lib/productos";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const productos = await getProductosAdmin();

  let email = "admin";
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? "admin";
  }

  return (
    <AdminShell email={email} productCount={productos.length}>
      {children}
    </AdminShell>
  );
}
