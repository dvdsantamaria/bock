export interface PhotoItem {
  id: number;
  title: string;
  subtitle?: string;
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
