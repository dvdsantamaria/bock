export interface Article {
  id: number | string;
  title: string;
  subtitle?: string;
  body: any;
  slug: string;
  category: string;
}

export interface Intro {
  id: "intro";
  title: string;
  subtitle?: string;
  body: any;
  slug: string;
  category: "intro";
}

export type WritingItem = Article | Intro;

export interface LinkItem {
  label: string;
  href: string;
}
