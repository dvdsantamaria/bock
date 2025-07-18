/* lib/design.ts */
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/* ── helpers ─────────────────────────────────────────────── */
const normalize = <T = any>(v: T | undefined): T | null =>
  v === undefined ? null : v;

/** Devuelve una URL válida tanto si `v` es string plano
 *  como si es un objeto media de Strapi (`{ url: "/..." }`)  */
const url = (v?: string | { url?: string } | null) =>
  typeof v === "string"
    ? v
    : v?.url
    ? v.url.startsWith("http")
      ? v.url
      : `${API}${v.url}`
    : null;

/* ── tipos ──────────────────────────────────────────────── */
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
  imageThumb?: string | null; // fallback legacy
  imageFull?: string | null;
}

export interface Intro {
  title: string;
  subtitle?: string | null;
  body: any;
  heroImage?: string | null;
}

/* ── single type : /design-intro ─────────────────────────── */
export const getDesignIntro = async (): Promise<Intro> => {
  try {
    const res = await fetch(`${API}/api/design-intro?populate=*`);
    const json = await res.json();
    const attr = json?.data?.attributes ?? json?.data ?? {};

    return {
      title: attr.title || "Design",
      subtitle: normalize(attr.subtitle),
      body: attr.content || [],
      heroImage: url(attr.heroImage),
    };
  } catch (err) {
    console.error("Error fetching design intro:", err);
    return { title: "Design", subtitle: null, body: null, heroImage: null };
  }
};

/* ── collection type : /designs ──────────────────────────── */
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
          attr.thumbPos === "bottom" ||
          attr.thumbPos === "center"
            ? attr.thumbPos
            : "center",

        /* nuevas URLs ya procesadas (string) */
        imageWatermarked: url(attr.imageWatermarked),
        imageThumbTop: url(attr.imageThumbTop),
        imageThumbCenter: url(attr.imageThumbCenter),
        imageThumbBottom: url(attr.imageThumbBottom),

        /* compat. legacy */
        imageThumb: url(attr.imageThumb),
        imageFull: url(attr.imageFull),
      };
    });
  } catch (err) {
    console.error("Error fetching design articles:", err);
    return [];
  }
};

export const getDesignSlugs = async () =>
  (await getDesignArticles()).map((a) => a.slug);
