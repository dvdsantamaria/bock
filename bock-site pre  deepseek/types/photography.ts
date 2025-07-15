export interface PhotographyBlock {
  id: number;
  title: string;
  subtitle?: string;
  body: string | { type: string; children: { text: string }[] }[];
  slug: string;
  category: string; // slug de la Category
  imageThumb?: string;
  imageFull?: string;
}

export interface PhotoItem {
  category: string;
  slug: string;
}
