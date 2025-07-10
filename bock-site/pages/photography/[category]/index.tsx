/* pages/photography/[category]/index.tsx
   — al entrar en /photography/<category> te envía a una foto aleatoria de esa categoría — */

import { useEffect } from "react";
import { useRouter } from "next/router";
import photos from "@/data/photography.json";

/* tipado mínimo:  solo necesitamos la lista de artículos */
interface PhotoItem {
  category: string;
  slug: string;
}

export default function PhotographyCategoryRedirect() {
  const router = useRouter();
  const { category } = router.query as { category?: string };

  useEffect(() => {
    if (!category) return; // aún sin hidratar

    /* filtra todos los ítems de la categoría */
    const list = (photos as { articles: PhotoItem[] }).articles.filter(
      (p) => p.category === category
    );

    /* si hay fotos ⇒ redirige a una aleatoria;
          si no existe la categoría, vuelve al índice general */
    if (list.length) {
      const random = list[Math.floor(Math.random() * list.length)];
      router.replace(`/photography/${random.category}/${random.slug}`);
    } else {
      router.replace("/photography");
    }
  }, [category, router]);

  /* nada que mostrar mientras redirige */
  return null;
}
