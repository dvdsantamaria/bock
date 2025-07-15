export interface DesignBlock {
  id: number;
  title: string;
  body: any;
  slug: string;

  /* opcionales — usados en DesignPage */
  subtitle?: string;
  imageThumb?: string;
  imageFull?: string;
}
