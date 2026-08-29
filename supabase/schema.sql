-- ============================================================
-- SCHEMA: nox-web (Brahian González — movilidad eléctrica)
-- Ejecutar una sola vez en el SQL Editor de Supabase, en orden.
-- Para cargar los productos de ejemplo ver supabase/seed.sql
-- ============================================================

create extension if not exists "pgcrypto";

-- ─── CATEGORIAS ─────────────────────────────────────────────
create table public.categorias (
  id         uuid not null default gen_random_uuid(),
  slug       text not null unique,
  nombre     text not null,
  orden      integer not null default 0,
  created_at timestamptz not null default now(),
  constraint categorias_pkey primary key (id)
);

-- ─── PRODUCTOS ──────────────────────────────────────────────
-- specs    : características técnicas, ej. [{"label":"Potencia motor","value":"500W"}]
-- imagenes : urls públicas del bucket "productos" en Storage
create table public.productos (
  id           uuid not null default gen_random_uuid(),
  slug         text not null unique,
  nombre       text not null,
  categoria_id uuid not null,
  etiqueta     text,
  descripcion  text,
  precio_ars   numeric not null default 0,
  precio_usd   numeric not null default 0,
  specs        jsonb not null default '[]'::jsonb,
  imagenes     text[] not null default '{}',
  publicado    boolean not null default true,
  orden        integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint productos_pkey primary key (id),
  constraint productos_categoria_id_fkey foreign key (categoria_id) references public.categorias (id) on delete restrict
);

create index productos_categoria_id_idx on public.productos (categoria_id);
create index productos_publicado_idx on public.productos (publicado);

-- ─── PROFILES (roles de admin) ──────────────────────────────
-- Se completa a mano: después de crear el usuario en Authentication,
-- insertar su id acá con role='admin' (ver instrucciones al final).
create table public.profiles (
  id         uuid not null,
  role       text not null default 'admin',
  created_at timestamptz not null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade
);

-- ─── RLS ────────────────────────────────────────────────────
alter table public.categorias enable row level security;
alter table public.productos enable row level security;
alter table public.profiles enable row level security;

-- lectura pública de categorías
create policy "categorias_select_public" on public.categorias
  for select using (true);

-- lectura pública solo de productos publicados
create policy "productos_select_public" on public.productos
  for select using (publicado = true);

-- admin autenticado: acceso total a categorías y productos
create policy "categorias_admin_all" on public.categorias
  for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "productos_admin_all" on public.productos
  for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- cada admin puede leer su propio perfil (lo necesita el middleware)
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);

-- ─── STORAGE: bucket de imágenes de productos ───────────────
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

create policy "productos_bucket_public_read" on storage.objects
  for select using (bucket_id = 'productos');

create policy "productos_bucket_admin_insert" on storage.objects
  for insert with check (
    bucket_id = 'productos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "productos_bucket_admin_update" on storage.objects
  for update using (
    bucket_id = 'productos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "productos_bucket_admin_delete" on storage.objects
  for delete using (
    bucket_id = 'productos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- PASO A PASO PARA DEJAR EL PROYECTO LISTO
-- ============================================================
-- 1. Correr todo este archivo en el SQL Editor de Supabase.
-- 2. Correr supabase/seed.sql para cargar categorías y productos de ejemplo.
-- 3. En Authentication → Users → "Add user", crear el usuario de Brahian
--    (email + contraseña).
-- 4. Copiar el UUID de ese usuario y correr:
--      insert into public.profiles (id, role) values ('<uuid-del-usuario>', 'admin');
-- 5. Copiar Project URL, anon key y service_role key (Settings → API)
--    a .env.local (ver .env.example).
-- ============================================================
