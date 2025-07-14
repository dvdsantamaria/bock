// lib/about.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export interface Article {
  id: number;
  title: string;
  subtitle?: string;
  body: any;
  slug: string;
  imageThumb?: string;
  imageFull?: string;
}

export interface Intro {
  title: string;
  subtitle?: string;
  body: any;
  heroImage?: string;
}

// Obtener datos de introducción
export const getAboutIntro = async (): Promise<Intro> => {
  const res = await fetch(`${API}/api/about-intro?populate=*`);
  const json = await res.json();
  const data = json.data;

  return {
    title: data.title,
    subtitle: data.subtitle,
    body: data.content,
    heroImage: data.heroImage?.url ? `${API}${data.heroImage.url}` : undefined,
  };
};

// Obtener todos los artículos
export const getAboutArticles = async (): Promise<Article[]> => {
  const res = await fetch(
    `${API}/api/abouts?populate=*&pagination[pageSize]=100`
  );
  const json = await res.json();

  return json.data.map((item: any) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    body: item.body || item.content,
    slug: item.slug,
    imageThumb: item.imageThumb?.url
      ? `${API}${item.imageThumb.url}`
      : undefined,
    imageFull: item.imageFull?.url ? `${API}${item.imageFull.url}` : undefined,
  }));
};

// Obtener slugs para rutas dinámicas
export const getAboutSlugs = async (): Promise<string[]> => {
  const articles = await getAboutArticles();
  return articles.map((article) => article.slug);
};
