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
      title: item.title,
      slug: item.slug,
      body: item.body || item.content,
      thumbPos: normalize(item.thumbPos),
      imageWatermarked: normalize(item.imageWatermarked),
      imageThumbTop: normalize(item.imageThumbTop),
      imageThumbCenter: normalize(item.imageThumbCenter),
      imageThumbBottom: normalize(item.imageThumbBottom),
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
