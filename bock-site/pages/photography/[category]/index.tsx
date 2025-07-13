import { useEffect } from "react";
import { useRouter } from "next/router";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function PhotographyCategoryRedirect() {
  const router = useRouter();
  const { category } = router.query as { category?: string };

  useEffect(() => {
    if (!category) return; // aún no se hidrata

    (async () => {
      try {
        const res = await fetch(
          `${API}/api/photographies?populate=Category,imageThumb,imageFull&filters[Category][slug][$eq]=${category}&pagination[pageSize]=100`
        );
        const json = await res.json();

        const photos: PhotographyBlock[] = json.data.map((it: any) => {
          const attrs = it.attributes || {}; // fallback por si no usa attributes
          return {
            id: it.id,
            title: attrs.title,
            subtitle: attrs.subtitle,
            body: attrs.body || attrs.content,
            slug: attrs.slug,
            category: attrs.Category?.data?.attributes?.slug || "uncategorised",
            imageThumb: attrs.imageThumb?.data?.attributes?.url
              ? `${API}${attrs.imageThumb.data.attributes.url}`
              : undefined,
            imageFull: attrs.imageFull?.data?.attributes?.url
              ? `${API}${attrs.imageFull.data.attributes.url}`
              : undefined,
          };
        });

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

  return null;
}
