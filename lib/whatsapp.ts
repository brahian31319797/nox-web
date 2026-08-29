import { fmtArs } from "./format";

export const WHATSAPP_NUMBER = "5493755649384";
export const INSTAGRAM_HANDLE = "brahiangonz.imp";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

export function buildGeneralWhatsAppUrl(): string {
  const msg = "¡Hola Brahian! Te escribo desde la web, quería hacerte una consulta 👋";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function buildProductWhatsAppUrl(producto: { nombre: string; precio_ars: number }): string {
  const msg = `¡Hola Brahian! Me interesa el ${producto.nombre} (${fmtArs(producto.precio_ars)}). ¿Está disponible?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
