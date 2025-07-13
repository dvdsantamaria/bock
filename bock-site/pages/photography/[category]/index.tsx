/* pages/photography/[category]/index.tsx
   Cuando entras en /photography/<category> te redirige
   a una foto aleatoria de esa categoría                    */

import { useEffect } from "react";
import { useRouter } from "next/router";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function PhotographyCategoryRedirect() {
  const router = useRouter();
  const { category } = router.query as { category?: string };

  useEffect(() => {
    if (!category) return; // todavía sin hidratar

    (async () => {
      try {
        /* sólo fotos de esa categoría */
        const res = await fetch(
          `${API}/api/photographies?populate=Category&filters[Category][slug][$eq]=${category}&pagination[pageSize]=100`
        ).then((r) => r.json());

        const photos: PhotographyBlock[] = res.data.map((it: any) => ({
          id: it.id,
          title: it.title,
          subtitle: it.subtitle,
          body: it.body || it.content,
          slug: it.slug,
          category: it.Category?.slug || "uncategorised",
          imageThumb: it.imageThumb?.url
            ? `${API}${it.imageThumb.url}`
            : undefined,
          imageFull: it.imageFull?.url
            ? `${API}${it.imageFull.url}`
            : undefined,
        }));

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

  /* Nada en pantalla mientras decide dónde ir */
  return null;
}
