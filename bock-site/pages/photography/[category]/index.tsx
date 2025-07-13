import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { PhotoItem } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function PhotographyCategoryRedirect() {
  const router = useRouter();
  const { category } = router.query as { category?: string };
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  useEffect(() => {
    if (!category) return;

    (async () => {
      try {
        const res = await fetch(`${API}/api/photos?populate=*`);
        const raw = await res.json();

        const allPhotos: PhotoItem[] = raw.data.map((it: any) => ({
          id: it.id,
          title: it.title,
          subtitle: it.subtitle,
          body: it.body || it.content,
          slug: it.slug,
          imageThumb: it.imageThumb?.url
            ? `${API}${it.imageThumb.url}`
            : undefined,
          imageFull: it.imageFull?.url
            ? `${API}${it.imageFull.url}`
            : undefined,
        }));

        const filtered = allPhotos.filter((p) => p.slug.startsWith(category));
        if (filtered.length) {
          const random = filtered[Math.floor(Math.random() * filtered.length)];
          router.replace(`/photography/${category}/${random.slug}`);
        } else {
          router.replace("/photography");
        }
      } catch (err) {
        console.error("Failed to fetch photos", err);
        router.replace("/photography");
      }
    })();
  }, [category, router]);

  return null;
}
