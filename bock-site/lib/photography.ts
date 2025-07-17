// lib/photography.ts

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Normaliza undefined a null
const normalize = <T = any>(v: T | undefined): T | null =>
  v === undefined ? null : v;

// Prefija la URL si empieza con "/"
const url = (v?: { url?: string }) =>
  v?.url && v.url.startsWith("/") ? `${API}${v.url}` : null;

export interface PhotoItem {
  id: number;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  category: string;
  slug: string;
  imageThumb?: string | null;
  imageFull?: string | null;
  thumbPos?: "top" | "center" | "bottom" | null;
  imageThumbTop?: string | null;
  imageThumbCenter?: string | null;
  imageThumbBottom?: string | null;
}

export const getAllPhotographies = async (): Promise<PhotoItem[]> => {
  try {
    const res = await fetch(
      `${API}/api/photographies?populate=*&pagination[pageSize]=200`
    );
    const json = await res.json();

    const list = Array.isArray(json.data) ? json.data : [];

    return list.map((item: any): PhotoItem => {
      const attr = item.attributes ?? {};

      return {
        id: item.id,
        title: attr.title || "Untitled",
        subtitle: normalize(attr.subtitle),
        body: normalize(attr.body),
        category: attr.Category?.data?.attributes?.slug || "uncategorised",
        slug: attr.slug || `no-slug-${item.id}`,
        imageThumb: url(attr.imageThumb),
        imageFull: url(attr.imageFull),

        // NUEVOS CAMPOS 👇
        thumbPos: attr.thumbPos ?? null,
        imageThumbTop: url(attr.imageThumbTop),
        imageThumbCenter: url(attr.imageThumbCenter),
        imageThumbBottom: url(attr.imageThumbBottom),
      };
    });
  } catch (error) {
    console.error("Error fetching photographs:", error);
    return [];
  }
};

export const getCategories = async (): Promise<string[]> => {
  const photos = await getAllPhotographies();
  return Array.from(new Set(photos.map((p) => p.category)));
};

export const getRandomPhotoForCategory = async (
  category: string
): Promise<PhotoItem | null> => {
  const photos = await getAllPhotographies();
  const filtered = photos.filter((p) => p.category === category);
  if (!filtered.length) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

export const getPhotoBySlug = async (
  slug: string
): Promise<PhotoItem | null> => {
  const photos = await getAllPhotographies();
  return photos.find((p) => p.slug === slug) || null;
};
