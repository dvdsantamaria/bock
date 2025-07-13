/* pages/photography/[category]/index.tsx
   — CSR: carga todas las fotos de la categoría y redirige a una aleatoria */
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function PhotographyCategoryRedirect() {
  const router = useRouter();
  const { category } = router.query as { category?: string };

  useEffect(() => {
    if (!category) return; // sin hidratar todavía

    (async () => {
      try {
        // *** NUEVA sintaxis populate ***
        const res = await fetch(
          `${API}/api/photographies` +
            `?filters[Category][slug][$eq]=${category}` +
            `&pagination[pageSize]=100` +
            `&populate[Category][fields][0]=slug` +
            `&populate[imageThumb][fields][0]=url` +
            `&populate[imageFull][fields][0]=url`
        ).then((r) => r.json());

        const photos: PhotographyBlock[] = Array.isArray(res.data)
          ? res.data.map((it: any) => {
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
          const rand = photos[Math.floor(Math.random() * photos.length)];
          router.replace(`/photography/${rand.category}/${rand.slug}`);
        } else {
          router.replace("/photography");
        }
      } catch (err) {
        console.error("Failed to fetch photos:", err);
        router.replace("/photography");
      }
    })();
  }, [category, router]);

  return null;
}
