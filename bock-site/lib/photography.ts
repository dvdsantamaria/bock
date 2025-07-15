// lib/photography.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Función para normalizar valores undefined → null
const normalize = (value: any) => (value === undefined ? null : value);

// Prefija la URL si empieza con "/"
const url = (p?: string) => (p && p.startsWith("/") ? `${API}${p}` : p ?? null);

export interface PhotoItem {
  id: number;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  category: string;
  slug: string;
  imageThumb?: string | null;
  imageFull?: string | null;
}

export const getAllPhotographies = async (): Promise<PhotoItem[]> => {
  try {
    const res = await fetch(
      `${API}/api/photographies?populate=*&pagination[pageSize]=200`
    );
    const json = await res.json();

    return (json.data as any[]).map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: normalize(p.subtitle),
      body: normalize(p.body),
      category: p.Category?.slug || "uncategorised",
      slug: p.slug,
      imageThumb: url(p.imageThumb?.url),
      imageFull: url(p.imageFull?.url),
    }));
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
  const categoryPhotos = photos.filter((p) => p.category === category);

  if (categoryPhotos.length === 0) return null;

  return categoryPhotos[Math.floor(Math.random() * categoryPhotos.length)];
};

export const getPhotoBySlug = async (
  slug: string
): Promise<PhotoItem | null> => {
  const photos = await getAllPhotographies();
  return photos.find((p) => p.slug === slug) || null;
};
