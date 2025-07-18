// lib/design.ts

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const normalize = <T = any>(v: T | undefined): T | null =>
  v === undefined ? null : v;

const toURL = (v?: { url?: string }): string | null => {
  if (!v?.url) return null;
  return v.url.startsWith("http") ? v.url : `${API}${v.url}`;
};

export interface Design {
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

export const getDesignIntro = async (): Promise<Intro> => {
  try {
    const res = await fetch(`${API}/api/design-intro?populate=*`);
    const json = await res.json();
    const attr = json?.data?.attributes ?? json?.data ?? {};

    return {
      title: attr.title || "Design",
      subtitle: normalize(attr.subtitle),
      body: attr.content || [],
      heroImage: toURL(attr.heroImage),
    };
  } catch (err) {
    console.error("Error fetching design intro:", err);
    return { title: "Design", subtitle: null, body: null, heroImage: null };
  }
};

export const getDesignArticles = async (): Promise<Design[]> => {
  try {
    const res = await fetch(
      `${API}/api/designs?populate=*&pagination[pageSize]=100`
    );
    const json = await res.json();

    const list = Array.isArray(json.data) ? json.data : [];

    return list.map((item: any): Design => {
      const attr = item?.attributes ?? item ?? {};

      return {
        id: item.id,
        title: attr.title || "Untitled",
        subtitle: normalize(attr.subtitle),
        body: Array.isArray(attr.body) ? attr.body : attr.content ?? [],
        slug: attr.slug || `no-slug-${item.id}`,
        thumbPos: attr.thumbPos ?? null,
        imageWatermarked: toURL(attr.imageWatermarked),
        imageThumbTop: toURL(attr.imageThumbTop),
        imageThumbCenter: toURL(attr.imageThumbCenter),
        imageThumbBottom: toURL(attr.imageThumbBottom),
        imageThumb: toURL(attr.imageThumb),
        imageFull: toURL(attr.imageFull),
      };
    });
  } catch (err) {
    console.error("Error fetching design articles:", err);
    return [];
  }
};

export const getDesignSlugs = async (): Promise<string[]> => {
  const articles = await getDesignArticles();
  return articles.map((a) => a.slug);
};
