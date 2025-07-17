// lib/design.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Normalizador
const normalize = (value: any) => (value === undefined ? null : value);

export interface Design {
  id: number;
  title: string;
  slug: string;
  body: any;
  thumbPos?: "top" | "center" | "bottom" | null;
  imageWatermarked?: string | null;
  imageThumbTop?: string | null;
  imageThumbCenter?: string | null;
  imageThumbBottom?: string | null;
}

export interface Intro {
  title: string;
  subtitle?: string | null;
  body: any;
  heroImage?: string | null;
}

export const getDesignArticles = async (): Promise<Design[]> => {
  try {
    const res = await fetch(
      `${API}/api/designs?sort[0]=createdAt:desc&pagination[pageSize]=100`
    );
    const json = await res.json();

    const articles = Array.isArray(json.data) ? json.data : [];

    return articles.map((item: any) => {
      const attrs = item?.attributes || {};
      return {
        id: item.id,
        title: attrs.title || "Untitled",
        slug: attrs.slug || `no-slug-${item.id}`,
        body: Array.isArray(attrs.body) ? attrs.body : [],
        thumbPos: normalize(attrs.thumbPos),
        imageWatermarked: normalize(attrs.imageWatermarked),
        imageThumbTop: normalize(attrs.imageThumbTop),
        imageThumbCenter: normalize(attrs.imageThumbCenter),
        imageThumbBottom: normalize(attrs.imageThumbBottom),
      };
    });
  } catch (error) {
    console.error("Error fetching design articles:", error);
    return [];
  }
};

export const getDesignSlugs = async (): Promise<string[]> => {
  const articles = await getDesignArticles();
  return articles.map((article) => article.slug);
};

export const getDesignIntro = async (): Promise<Intro> => {
  try {
    const res = await fetch(`${API}/api/design-intro?populate=*`);
    const json = await res.json();
    const data = json?.data;
    const attrs = data?.attributes;

    if (!attrs) throw new Error("No attributes in design-intro");

    return {
      title: attrs.title || "Design",
      subtitle: normalize(attrs.subtitle),
      body: attrs.content,
      heroImage: attrs.heroImage?.url ? `${API}${attrs.heroImage.url}` : null,
    };
  } catch (err) {
    console.error("Error fetching design intro:", err);
    return { title: "Design", subtitle: null, body: null, heroImage: null };
  }
};
