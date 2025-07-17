// lib/about.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Función para normalizar valores undefined → null
const normalize = (value: any) => (value === undefined ? null : value);

export interface Article {
  id: number;
  title: string;
  subtitle?: string | null;
  body: any;
  slug: string;
  imageThumb?: string | null;
  imageFull?: string | null;
}

export interface Intro {
  title: string;
  subtitle?: string | null;
  body: any;
  heroImage?: string | null;

  // Nuevos campos relacionados al thumbnail principal
  thumbPos?: "top" | "center" | "bottom";
  imageThumbTop?: string | null;
  imageThumbCenter?: string | null;
  imageThumbBottom?: string | null;
}

export const getAboutIntro = async (): Promise<Intro> => {
  try {
    const res = await fetch(`${API}/api/about-intro?populate=*`);
    const json = await res.json();
    const data = json.data;

    return {
      title: data.title,
      subtitle: normalize(data.subtitle),
      body: data.content,
      heroImage: data.heroImage?.url ? `${API}${data.heroImage.url}` : null,

      // Agregados
      thumbPos: data.thumbPos ?? "center",
      imageThumbTop: data.imageThumbTop ?? null,
      imageThumbCenter: data.imageThumbCenter ?? null,
      imageThumbBottom: data.imageThumbBottom ?? null,
    };
  } catch (error) {
    console.error("Error fetching about intro:", error);
    return {
      title: "About",
      subtitle: null,
      body: null,
      heroImage: null,
      thumbPos: "center",
      imageThumbTop: null,
      imageThumbCenter: null,
      imageThumbBottom: null,
    };
  }
};

export const getAboutArticles = async (): Promise<Article[]> => {
  try {
    const res = await fetch(
      `${API}/api/abouts?populate=*&pagination[pageSize]=100`
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
    console.error("Error fetching about articles:", error);
    return [];
  }
};

export const getAboutSlugs = async (): Promise<string[]> => {
  const articles = await getAboutArticles();
  return articles.map((article) => article.slug);
};
