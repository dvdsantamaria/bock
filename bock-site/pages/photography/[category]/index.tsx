/* pages/photography/[category]/index.tsx
   ─ Al entrar en /photography/<category> carga las fotos de esa
     categoría y redirige a una aleatoria (CSR).                   */

import { useEffect } from "react";
import { useRouter } from "next/router";
import type { PhotographyBlock } from "@/types/photography"; // ← solo este

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function PhotographyCategoryRedirect() {
  const router = useRouter();
  const { category } = router.query as { category?: string };

  useEffect(() => {
    if (!category) return; // aún sin hidratar

    (async () => {
      try {
        const res = await fetch(
          `${API}/api/photographies?filters[Category][slug][$eq]=${category}&pagination[pageSize]=100&populate[Category][fields][0]=slug&populate[imageThumb][fields][0]=url&populate[imageFull][fields][0]=url`
        );
        const json = await res.json();

        const photos: PhotographyBlock[] = Array.isArray(json.data)
          ? json.data.map((it: any) => {
              const a = it.attributes;
              return {
                id: it.id,
                title: a.title,
                subtitle: a.subtitle ?? "",
                body: a.body ?? a.content ?? "",
                slug: a.slug,
                category: a.Category?.data?.attributes?.slug ?? "uncategorised",
                imageThumb: a.imageThumb?.data?.attributes?.url
                  ? `${API}${a.imageThumb.data.attributes.url}`
                  : undefined,
                imageFull: a.imageFull?.data?.attributes?.url
                  ? `${API}${a.imageFull.data.attributes.url}`
                  : undefined,
              };
            })
          : [];

        if (photos.length) {
          const random = photos[Math.floor(Math.random() * photos.length)];
          router.replace(`/photography/${random.category}/${random.slug}`);
        } else {
          router.replace("/photography");
        }
      } catch (err) {
        console.error("Failed to fetch photos:", err);
        router.replace("/photography");
      }
    })();
  }, [category, router]);

  return null; // nada visible
}
