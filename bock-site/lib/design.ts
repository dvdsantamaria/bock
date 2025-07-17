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

export const getDesignArticles = async (): Promise<Design[]> => {
  try {
    const res = await fetch(
      `${API}/api/designs?sort[0]=createdAt:desc&pagination[pageSize]=100`
    );
    const json = await res.json();

    return json.data.map((item: any) => ({
      id: item.id,
      title: item.attributes.title,
      slug: item.attributes.slug,
      body: Array.isArray(item.attributes.body) ? item.attributes.body : [],
      thumbPos: normalize(item.attributes.thumbPos),
      imageWatermarked: normalize(item.attributes.imageWatermarked),
      imageThumbTop: normalize(item.attributes.imageThumbTop),
      imageThumbCenter: normalize(item.attributes.imageThumbCenter),
      imageThumbBottom: normalize(item.attributes.imageThumbBottom),
    }));
  } catch (error) {
    console.error("Error fetching design articles:", error);
    return [];
  }
};

export const getDesignSlugs = async (): Promise<string[]> => {
  const articles = await getDesignArticles();
  return articles.map((article) => article.slug);
};
