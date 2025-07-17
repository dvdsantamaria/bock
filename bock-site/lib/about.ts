// lib/about.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/** Convierte `undefined` en `null` para no romper el tipado / render */
const normalize = <T = any>(v: T | undefined): T | null =>
  v === undefined ? null : v;

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export interface Article {
  id: number;
  title: string;
  subtitle?: string | null;
  body: any;
  slug: string;

  /** nuevo: posición elegida para el thumb */
  thumbPos?: "top" | "center" | "bottom" | null;

  /** nuevo: imagen grande con marca de agua */
  imageWatermarked?: string | null;

  /** thumbs generados en Cloudinary */
  imageThumbTop?: string | null;
  imageThumbCenter?: string | null;
  imageThumbBottom?: string | null;

  /** compatibilidad con contenido viejo                     */
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
/*  Helpers de fetch                                                  */
/* ------------------------------------------------------------------ */

export const getAboutIntro = async (): Promise<Intro> => {
  try {
    const res = await fetch(`${API}/api/about-intro?populate=*`);
    const { data } = await res.json();

    return {
      title: data.title,
      subtitle: normalize(data.subtitle),
      body: data.content,
      heroImage: data.heroImage?.url ? `${API}${data.heroImage.url}` : null,
    };
  } catch (err) {
    console.error("Error fetching about intro:", err);
    return { title: "About", subtitle: null, body: null, heroImage: null };
  }
};

export const getAboutArticles = async (): Promise<Article[]> => {
  try {
    const res = await fetch(
      `${API}/api/abouts?populate=*&pagination[pageSize]=100`
    );
    const { data } = await res.json();

    return data.map(
      (item: any): Article => ({
        id: item.id,
        title: item.title,
        subtitle: normalize(item.subtitle),
        body: item.body || item.content,
        slug: item.slug,

        /* ---------- nuevos campos ---------- */
        thumbPos: item.thumbPos ?? null,
        imageWatermarked: item.imageWatermarked ?? null,
        imageThumbTop: item.imageThumbTop ?? null,
        imageThumbCenter: item.imageThumbCenter ?? null,
        imageThumbBottom: item.imageThumbBottom ?? null,

        /* ---------- fallback legacy -------- */
        imageThumb: item.imageThumb?.url
          ? `${API}${item.imageThumb.url}`
          : null,
        imageFull: item.imageFull?.url ? `${API}${item.imageFull.url}` : null,
      })
    );
  } catch (err) {
    console.error("Error fetching about articles:", err);
    return [];
  }
};

export const getAboutSlugs = async (): Promise<string[]> => {
  const articles = await getAboutArticles();
  return articles.map((a) => a.slug);
};
