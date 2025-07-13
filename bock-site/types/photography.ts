/* types/photography.ts */

/** Fotografía o bloque de galería */
export interface PhotographyBlock {
  id: number;
  title: string;
  subtitle?: string;
  body: string | { type: string; children: { text: string }[] }[];
  slug: string; // ej: blur/seaspray-fog
  category: string; // slug de la categoría (relación Category)
  imageThumb?: string; // miniatura
  imageFull?: string; // hero / foto grande
}
