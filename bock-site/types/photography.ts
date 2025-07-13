export interface PhotographyBlock {
  slug: string;
  title: string;
  body: string | { type: string; children: { text: string }[] }[];
  imageThumb?: string;
  imageFull?: string;
  subtitle?: string;
}
