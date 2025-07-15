// types/about.ts
export interface AboutBlock {
  id: number | string;
  title: string;
  body: any; // si viene como texto enriquecido o array
  slug: string;
}

export interface LinkItem {
  label: string;
  href: string;
}
