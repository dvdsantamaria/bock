// lib/design.ts

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const normalize = <T = any>(v: T | undefined): T | null =>
  v === undefined ? null : v;

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
      heroImage: attr.heroImage?.url ? `${API}${attr.heroImage.url}` : null,
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
        thumbPos:
          attr.thumbPos === "top" ||
          attr.thumbPos === "center" ||
          attr.thumbPos === "bottom"
            ? attr.thumbPos
            : "center",
        imageWatermarked: attr.imageWatermarked?.url
          ? `${API}${attr.imageWatermarked.url}`
          : null,
        imageThumbTop: attr.imageThumbTop?.url
          ? `${API}${attr.imageThumbTop.url}`
          : null,
        imageThumbCenter: attr.imageThumbCenter?.url
          ? `${API}${attr.imageThumbCenter.url}`
          : null,
        imageThumbBottom: attr.imageThumbBottom?.url
          ? `${API}${attr.imageThumbBottom.url}`
          : null,
        imageThumb: attr.imageThumb?.url
          ? `${API}${attr.imageThumb.url}`
          : null,
        imageFull: attr.imageFull?.url ? `${API}${attr.imageFull.url}` : null,
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

export { getAboutArticles };
