-- ============================================================
-- Tanda 2 — Panel de administración
-- Correr una sola vez en el SQL Editor de Supabase.
-- ============================================================

-- Hasta ahora la home mostraba los 3 primeros productos por "orden", así que
-- para cambiar un destacado había que reordenar todo el catálogo.
alter table public.productos
  add column if not exists destacado boolean not null default false;

-- Brahian trabaja a pedido: no maneja stock, maneja plazos. Texto libre a
-- propósito — "7 a 10 días", "Entrega inmediata", "Consultar" — porque él sabe
-- mejor que nosotros qué corresponde en cada caso.
alter table public.productos
  add column if not exists entrega text;

-- Índice parcial: solo indexa las filas destacadas, que son pocas.
create index if not exists productos_destacado_idx
  on public.productos (destacado)
  where destacado;

-- Arranque razonable: los 3 que hoy salen en la home quedan marcados,
-- así la portada no cambia sola al desplegar.
update public.productos
set destacado = true
where id in (
  select id from public.productos
  where publicado = true
  order by orden
  limit 3
);
