export interface PhotoItem {
  id: number | "intro";
  title: string;
  subtitle?: string;
  body?: string;
  category: string;
  slug: string;
  imageThumb?: string;
  imageFull?: string;
}

export interface PhotographyData {
  intro: PhotoItem;
  photos: PhotoItem[];
  categories: string[];
}
