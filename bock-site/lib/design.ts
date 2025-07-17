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

export const getDesignIntro = async (): Promise<Intro> => {
  try {
    const res = await fetch(`${API}/api/design-intro?populate=*`);
    const { data } = await res.json();

    return {
      title: data.attributes.title,
      subtitle: normalize(data.attributes.subtitle),
      body: data.attributes.content,
      heroImage: data.attributes.heroImage?.url
        ? `${API}${data.attributes.heroImage.url}`
        : null,
    };
  } catch (err) {
    console.error("Error fetching design intro:", err);
    return { title: "Design", subtitle: null, body: null, heroImage: null };
  }
};
