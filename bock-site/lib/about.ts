// lib/about.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const normalize = <T = any>(v: T | undefined): T | null =>
  v === undefined ? null : v;

/* ---------- tipos ---------- */
export interface Article {
  id: number;
  title: string;
  subtitle?: string | null;
  body: any;
  slug: string;
  thumbPos?: "top" | "center" | "bottom" | null;
  imageWatermarked?: string | null;
  imageThumbTop?: string | null;
  imageThumbCenter?: string | null;
  imageThumbBottom?: string | null;
  imageThumb?: string | null;
  imageFull?: string | null;
}

export interface Intro {
  title: string;
  subtitle?: string | null;
  body: any;
  heroImage?: string | null;
}

/* ---------- helper ---------- */
const toUrl = (v: any): string | null => {
  if (!v) return null;
  if (typeof v === "string") return v; // ya es una URL absoluta
  if (typeof v === "object" && typeof v.url === "string")
    return v.url.startsWith("/") ? `${API}${v.url}` : v.url;
  return null;
};

/* ---------- single type ---------- */
export const getAboutIntro = async (): Promise<Intro> => {
  try {
    const res = await fetch(`${API}/api/about-intro?populate=*`);
    const json = await res.json();
    const attr = json?.data?.attributes ?? json?.data ?? {};

    return {
      title: attr.title || "About",
      subtitle: normalize(attr.subtitle),
      body: attr.content || [],
      heroImage: toUrl(attr.heroImage),
    };
  } catch (err) {
    console.error("Error fetching about intro:", err);
    return { title: "About", subtitle: null, body: null, heroImage: null };
  }
};

/* ---------- collection type ---------- */
export const getAboutArticles = async (): Promise<Article[]> => {
  try {
    const res = await fetch(
      `${API}/api/abouts?populate=*&pagination[pageSize]=100`
    );
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : [];

    return list.map((item: any): Article => {
      const attr = item?.attributes ?? item ?? {};

      return {
        id: item.id,
        title: attr.title || "Untitled",
        subtitle: normalize(attr.subtitle),
        body: Array.isArray(attr.body) ? attr.body : attr.content ?? [],
        slug: attr.slug || `no-slug-${item.id}`,
        thumbPos:
          attr.thumbPos === "top" ||
          attr.thumbPos === "center" ||
          attr.thumbPos === "bottom"
            ? attr.thumbPos
            : "center",
        imageWatermarked: toUrl(attr.imageWatermarked),
        imageThumbTop: toUrl(attr.imageThumbTop),
        imageThumbCenter: toUrl(attr.imageThumbCenter),
        imageThumbBottom: toUrl(attr.imageThumbBottom),
        imageThumb: toUrl(attr.imageThumb),
        imageFull: toUrl(attr.imageFull),
      };
    });
  } catch (err) {
    console.error("Error fetching about articles:", err);
    return [];
  }
};

export const getAboutSlugs = async (): Promise<string[]> => {
  const articles = await getAboutArticles();
  return articles.map((a) => a.slug);
};
