import dynamic from "next/dynamic";
import photographyJson from "@/data/photography.json";

/* mismo tipo local */
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

const PhotographyPage = dynamic(() => import("@/components/PhotographyPage"), {
  ssr: false, // evita hydration warnings por <img>
});

export default function PhotographyIndex() {
  const { intro, articles } = photographyJson as PhotographyJson;

  const related = articles.map((a) => ({
    label: a.title,
    href: `/photography/${a.category}/${a.slug}`,
    thumb: a.imageThumb,
  }));

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <PhotographyPage
      json={photographyJson as any}
      active={intro}
      related={related}
      categories={categories}
    />
  );
}
