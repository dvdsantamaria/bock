// lib/photography.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://109.235.65.193:1337";

/* -------------------- Helpers -------------------- */
const normalize = <T = any>(v: T | undefined): T | null =>
  v === undefined ? null : v;

const abs = (v?: { url?: string }) =>
  v?.url && v.url.startsWith("/") ? `${API}${v.url}` : null;

const imageUrl = (entry?: { data?: { attributes?: { url?: string } } }) =>
  abs(entry?.data?.attributes);

/* -------------------- Tipos -------------------- */
export interface PhotoItem {
  id: number;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  category: string;
  slug: string;
  thumbPos: "top" | "center" | "bottom" | null;
  imageFull: string | null;
  imageThumbTop: string | null;
  imageThumbCenter: string | null;
  imageThumbBottom: string | null;
}

/* -------------------- Intro (placeholder) -------------------- */
export const getPhotographyIntro = async (): Promise<PhotoItem> => ({
  id: 0,
  title: "Photography",
  subtitle: null,
  body: null,
  category: "intro",
  slug: "intro",
  thumbPos: null,
  imageFull: null,
  imageThumbTop: null,
  imageThumbCenter: null,
  imageThumbBottom: null,
});

/* -------------------- Todas las fotos -------------------- */
export const getPhotographyPhotos = async (): Promise<PhotoItem[]> => {
  try {
    const res = await fetch(
      `${API}/api/photographies?populate=*&pagination[pageSize]=200`
    );
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : [];

    return list.map((item: any): PhotoItem => {
      const attr = item.attributes || item;

      return {
        id: item.id,
        title: attr.title || "Untitled",
        subtitle: normalize(attr.subtitle),
        body: normalize(attr.body),
        category:
          attr.Category?.slug ||
          attr.Category?.name?.toLowerCase?.() ||
          attr.category?.slug ||
          attr.category ||
          "general",
        slug: attr.slug || `no-slug-${item.id}`,
        thumbPos: attr.thumbPos ?? "center",

        imageFull: attr.imageWatermarked ?? null,
        imageThumbTop: attr.imageThumbTop ?? null,
        imageThumbCenter: attr.imageThumbCenter ?? null,
        imageThumbBottom: attr.imageThumbBottom ?? null,
      };
    });
  } catch (error) {
    console.error("Error fetching photographs:", error);
    return [];
  }
};

/* -------------------- Extras -------------------- */
export const getCategories = async (): Promise<string[]> => {
  const photos = await getPhotographyPhotos();
  return Array.from(new Set(photos.map((p) => p.category)));
};

export const getRandomPhotoForCategory = async (
  category: string
): Promise<PhotoItem | null> => {
  const photos = await getPhotographyPhotos();
  const filtered = photos.filter((p) => p.category === category);
  return filtered.length
    ? filtered[Math.floor(Math.random() * filtered.length)]
    : null;
};

export const getPhotoBySlug = async (
  slug: string
): Promise<PhotoItem | null> => {
  const photos = await getPhotographyPhotos();
  return photos.find((p) => p.slug === slug) || null;
};
