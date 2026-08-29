export type CategoriaSlug = "monopatin" | "moto" | "bici";

export interface Categoria {
  id: string;
  slug: CategoriaSlug;
  nombre: string;
  orden: number;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  categoria_id: string;
  categoria: Categoria;
  etiqueta: string | null;
  descripcion: string | null;
  precio_ars: number;
  precio_usd: number;
  specs: Spec[];
  imagenes: string[];
  publicado: boolean;
  orden: number;
}

/** Payload que acepta el formulario del panel admin (sin campos generados por la base). */
export type ProductoInput = Omit<Producto, "id" | "categoria" | "orden">;
