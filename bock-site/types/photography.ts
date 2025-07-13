export interface PhotographyBlock {
  id: number;
  title: string;
  subtitle?: string;
  body: string | { type: string; children: { text: string }[] }[];
  slug: string;
  /** miniatura — se usa en el sidebar  */
  imageThumb?: string;
  /** foto grande / hero  */
  imageFull?: string;
  /** categoría (slug) sacada de la relación Category */
  category: string;
}
