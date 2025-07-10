import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import photographyJson from "@/data/photography.json";

/* ——— declaramos el tipo aquí en vez de importarlo ——— */
interface PhotoItem {
  id: number | "intro";
  title: string;
  subtitle?: string;
  body?: string;
  category: string;
  slug: string;
  imageThumb?: string;
  imageFull?: string;
}
interface PhotographyJson {
  intro: PhotoItem;
  articles: PhotoItem[];
}
/* ———————————————————————————————————————————————— */

const PhotographyPage = dynamic(() => import("@/components/PhotographyPage"), {
  ssr: false,
});

export default function PhotographyDetail() {
  const { query } = useRouter();
  const { category, slug } = query as { category?: string; slug?: string };

  if (!category || !slug) return null; // SSR fallback

  const { intro, articles } = photographyJson as unknown as PhotographyJson;

  /* foto activa (o intro como reserva) */
  const photo =
    articles.find((p) => p.category === category && p.slug === slug) ?? intro;

  /* thumbs dentro de la misma categoría */
  const related = articles
    .filter((p) => p.category === category && p.id !== photo.id)
    .map((p) => ({
      label: p.title,
      href: `/photography/${p.category}/${p.slug}`,
      thumb: p.imageThumb,
    }));

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <PhotographyPage
      json={photographyJson as any}
      active={photo}
      related={related}
      categories={categories}
    />
  );
}
