import dynamic from "next/dynamic";
import photographyJson from "@/data/photography.json";
import type { PhotographyJson } from "@/components/PhotographyPage";

const PhotographyPage = dynamic(() => import("@/components/PhotographyPage"), {
  ssr: false, // prevents hydration warnings due to <img>
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
