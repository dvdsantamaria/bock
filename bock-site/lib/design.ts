// lib/design.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Convierte undefined en null
const normalize = <T = any>(v: T | undefined): T | null =>
  v === undefined ? null : v;

/* ------------------------------------------------------------------ */
/* Tipos                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Fetch: Intro                                                        */
/* ------------------------------------------------------------------ */

export const getDesignIntro = async (): Promise<Intro> => {
  try {
    const res = await fetch(`${API}/api/design-intro?populate=*`);
    const { data } = await res.json();
    const attr = data?.attributes;

    if (!attr) throw new Error("Missing attributes in design-intro");

    return {
      title: attr.title || "Design",
      subtitle: normalize(attr.subtitle),
      body: attr.content,
      heroImage: attr.heroImage?.url ? `${API}${attr.heroImage.url}` : null,
    };
  } catch (err) {
    console.error("Error fetching design intro:", err);
    return { title: "Design", subtitle: null, body: null, heroImage: null };
  }
};

/* ------------------------------------------------------------------ */
/* Fetch: Articles                                                    */
/* ------------------------------------------------------------------ */

export const getDesignArticles = async (): Promise<Design[]> => {
  try {
    const res = await fetch(
      `${API}/api/designs?populate=*&sort[0]=createdAt:desc&pagination[pageSize]=100`
    );
    const { data } = await res.json();

    return data.map((item: any): Design => {
      const attr = item.attributes;

      return {
        id: item.id,
        title: attr.title || "Untitled",
        subtitle: normalize(attr.subtitle),
        body: Array.isArray(attr.body) ? attr.body : attr.content,
        slug: attr.slug || `no-slug-${item.id}`,

        // Nuevos campos con thumbs
        thumbPos: attr.thumbPos ?? null,
        imageWatermarked: attr.imageWatermarked ?? null,
        imageThumbTop: attr.imageThumbTop ?? null,
        imageThumbCenter: attr.imageThumbCenter ?? null,
        imageThumbBottom: attr.imageThumbBottom ?? null,

        // Compatibilidad con versiones anteriores
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

/* ------------------------------------------------------------------ */
/* Slugs                                                              */
/* ------------------------------------------------------------------ */

export const getDesignSlugs = async (): Promise<string[]> => {
  const articles = await getDesignArticles();
  return articles.map((a) => a.slug);
};
