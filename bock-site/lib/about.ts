// /lib/about.ts
const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface Intro {
  title: string;
  subtitle: string | null; // Ahora es null si no existe
  body: any;
  heroImage: string | null;
}

export interface Article {
  id: number;
  title: string;
  subtitle: string | null;
  body: any;
  slug: string;
  imageThumb: string | null;
  imageFull: string | null;
}

/* --- helpers --- */
export async function fetchIntro(): Promise<Intro> {
  const res = await fetch(`${API}/api/about-intro?populate=*`);
  const raw = (await res.json()).data;
  return {
    title: raw.title,
    subtitle: raw.subtitle ?? null, // SIEMPRE null en vez de undefined
    body: raw.content,
    heroImage: raw.heroImage?.url ? `${API}${raw.heroImage.url}` : null, // null
  };
}

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(
    `${API}/api/abouts?populate=*&pagination[pageSize]=100`
  );
  const json = await res.json();
  return json.data.map((item: any) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle ?? null,
    body: item.body || item.content,
    slug: item.slug,
    imageThumb: item.imageThumb?.url ? `${API}${item.imageThumb.url}` : null,
    imageFull: item.imageFull?.url ? `${API}${item.imageFull.url}` : null,
  }));
}

export async function getAllSlugs(): Promise<string[]> {
  const articles = await fetchArticles();
  return articles.map((a) => a.slug);
}
