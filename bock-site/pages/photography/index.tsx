import dynamic from "next/dynamic";
import photographyJson from "@/data/photography.json";

/* carga diferida para evitar hydration-warnings de <img> */
const PhotographyPage = dynamic(() => import("@/components/PhotographyPage"), {
  ssr: false,
}) as any; // <- evita que TS se queje por las props adicionales

export default function PhotographyIndex() {
  const { intro, articles } = photographyJson as any;

  const related = articles.map((a: any) => ({
    label: a.title,
    href: `/photography/${a.category}/${a.slug}`,
    thumb: a.imageThumb,
  }));

  const categories = Array.from(new Set(articles.map((a: any) => a.category)));

  return (
    <PhotographyPage active={intro} related={related} categories={categories} />
  );
}
