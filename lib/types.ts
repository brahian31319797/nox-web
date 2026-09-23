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
  /** Sale en la portada. Antes la home tomaba los 3 primeros por `orden`. */
  destacado: boolean;
  /** Plazo de entrega en texto libre ("7 a 10 días"). Reemplaza al stock:
      Brahian trabaja a pedido, así que no maneja unidades, maneja plazos. */
  entrega: string | null;
  orden: number;
}

/** Payload que acepta el formulario del panel admin (sin campos generados por la base). */
export type ProductoInput = Omit<Producto, "id" | "categoria" | "orden">;
