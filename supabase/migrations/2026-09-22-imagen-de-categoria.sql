-- ============================================================
-- Imagen de portada por categoría
-- Correr una sola vez en el SQL Editor de Supabase.
-- ============================================================

-- Las tarjetas de categoría mostraban un dibujo genérico. Ahora pueden llevar
-- una foto real, que se gestiona desde el panel.
-- Las imágenes se guardan en el bucket "productos", bajo la carpeta
-- "categorias/": reusar ese bucket evita duplicar las políticas de acceso que
-- ya están puestas y probadas.
alter table public.categorias
  add column if not exists imagen text;
