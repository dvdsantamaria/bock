// lib/writing.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Función para normalizar valores undefined → null
const normalize = (value: any) => (value === undefined ? null : value);

export interface Article {
  id: number;
  title: string;
  subtitle: string | null;
  body: any;
  slug: string;
  category: string;
}

export interface Intro {
  id: string; // Siempre "intro"
  title: string;
  subtitle: string | null;
  body: any;
  slug: string;
  category: string; // Siempre "intro"
}

export interface LinkItem {
  label: string;
  href: string;
}

export const getWritingIntro = async (): Promise<Intro> => {
  try {
    const res = await fetch(`${API}/api/writing-intro?populate=*`);
    const json = await res.json();
    const data = json.data;

    return {
      id: "intro",
      title: data.name || data.title,
      subtitle: normalize(data.subtitle),
      body: data.content || data.body,
      slug: data.slug,
      category: "intro",
    };
  } catch (error) {
    console.error("Error fetching writing intro:", error);
    return {
      id: "intro",
      title: "Writing",
      subtitle: null,
      body: null,
      slug: "intro",
      category: "intro",
    };
  }
};

export const getWritingArticles = async (): Promise<Article[]> => {
  try {
    const res = await fetch(
      `${API}/api/writings?populate[Category][fields][0]=slug&pagination[pageSize]=100`
    );
    const json = await res.json();

    return json.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      subtitle: normalize(item.subtitle),
      body: item.body || item.content,
      slug: item.slug,
      category: item.Category?.slug || "uncategorised",
    }));
  } catch (error) {
    console.error("Error fetching writing articles:", error);
    return [];
  }
};

export const getWritingCategories = async (): Promise<string[]> => {
  const articles = await getWritingArticles();
  return Array.from(new Set(articles.map((a) => a.category)));
};

export const getWritingSlugs = async (): Promise<
  { category: string; slug: string }[]
> => {
  const articles = await getWritingArticles();
  return articles.map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
};
