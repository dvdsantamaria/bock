// lib/photography.ts

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Normaliza undefined a null
const normalize = <T = any>(v: T | undefined): T | null =>
  v === undefined ? null : v;

// Prefija la URL si empieza con "/"
const abs = (v?: { url?: string }) =>
  v?.url && v.url.startsWith("/") ? `${API}${v.url}` : null;

/* -------------------------- Tipos principales -------------------------- */

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

/* ------------------------- Intro global (fake) ------------------------- */

export const getPhotographyIntro = async (): Promise<PhotoItem> => {
  // Si más adelante querés que esto venga desde otro endpoint, se reemplaza
  return {
    id: 0,
    title: "Photography",
    subtitle: null,
    body: null,
    category: "intro",
    slug: "intro",
    imageThumb: null,
    imageFull: null,
    thumbPos: null,
    imageThumbTop: null,
    imageThumbCenter: null,
    imageThumbBottom: null,
  };
};

/* ---------------------------- Todas las fotos ---------------------------- */

export const getPhotographyPhotos = async (): Promise<PhotoItem[]> => {
  try {
    const res = await fetch(
      `${API}/api/photographies?populate=*&pagination[pageSize]=200`
    );
    const json = await res.json();

    const list = Array.isArray(json.data) ? json.data : [];

    return list.map((item: any): PhotoItem => {
      // No hay item.attributes en tu API, accedemos directo a item
      return {
        id: item.id,
        title: item.title || "Untitled",
        subtitle: normalize(item.subtitle),
        body: normalize(item.body),
        category: item.Category?.slug || "uncategorised",
        slug: item.slug || `no-slug-${item.id}`,
        imageThumb: abs(item.imageThumb),
        imageFull: abs(item.imageFull),
        thumbPos: item.thumbPos ?? null,
        imageThumbTop: abs(item.imageThumbTop),
        imageThumbCenter: abs(item.imageThumbCenter),
        imageThumbBottom: abs(item.imageThumbBottom),
      };
    });
  } catch (error) {
    console.error("Error fetching photographs:", error);
    return [];
  }
};

/* ------------------------ Extras opcionales ------------------------ */

export const getCategories = async (): Promise<string[]> => {
  const photos = await getPhotographyPhotos();
  return Array.from(new Set(photos.map((p) => p.category)));
};

export const getRandomPhotoForCategory = async (
  category: string
): Promise<PhotoItem | null> => {
  const photos = await getPhotographyPhotos();
  const filtered = photos.filter((p) => p.category === category);
  if (!filtered.length) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

export const getPhotoBySlug = async (
  slug: string
): Promise<PhotoItem | null> => {
  const photos = await getPhotographyPhotos();
  return photos.find((p) => p.slug === slug) || null;
};
