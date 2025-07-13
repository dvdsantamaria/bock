/* pages/photography/[category]/index.tsx
   ─ Al entrar en /photography/<category> carga las fotos de esa
     categoría y redirige a una aleatoria (CSR).                   */

import { useEffect } from "react";
import { useRouter } from "next/router";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function PhotographyCategoryRedirect() {
  const router = useRouter();
  const { category } = router.query as { category?: string };

  useEffect(() => {
    /* Aún sin hidratar → salir */
    if (!category) return;

    (async () => {
      try {
        /* Solo entradas cuya relación Category coincide con el slug */
        const res = await fetch(
          `${API}/api/photographies?populate=Category,imageThumb,imageFull&filters[Category][slug][$eq]=${category}&pagination[pageSize]=100`
        );
        const json = await res.json();

        /* Map a nuestro tipo fuerte */
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

        /* Si existen fotos, redirige; si no, vuelve al índice */
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

  /* Nada visible mientras decide adónde ir */
  return null;
}
