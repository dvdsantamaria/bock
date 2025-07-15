// lib/design.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Función para normalizar valores undefined → null
const normalize = (value: any) => (value === undefined ? null : value);

export interface BaseItem {
  id: number;
  title: string;
  subtitle?: string | null;
  body: any;
  slug: string;
  imageThumb?: string | null;
  imageFull?: string | null;
}

export interface IntroItem {
  title: string;
  subtitle?: string | null;
  body: any;
  heroImage?: string | null;
}

export const getDesignIntro = async (): Promise<IntroItem> => {
  try {
    const res = await fetch(`${API}/api/design-intro?populate=*`);
    const json = await res.json();
    const data = json.data;

    return {
      title: data.title,
      subtitle: normalize(data.subtitle),
      body: data.content || data.body,
      heroImage: data.imageFull?.url ? `${API}${data.imageFull.url}` : null,
    };
  } catch (error) {
    console.error("Error fetching design intro:", error);
    return {
      title: "Design",
      subtitle: null,
      body: null,
      heroImage: null,
    };
  }
};

export const getDesignArticles = async (): Promise<BaseItem[]> => {
  try {
    const res = await fetch(
      `${API}/api/designs?populate=*&pagination[pageSize]=100`
    );
    const json = await res.json();

    return json.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      subtitle: normalize(item.subtitle),
      body: item.body || item.content,
      slug: item.slug,
      imageThumb: item.imageThumb?.url ? `${API}${item.imageThumb.url}` : null,
      imageFull: item.imageFull?.url ? `${API}${item.imageFull.url}` : null,
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
