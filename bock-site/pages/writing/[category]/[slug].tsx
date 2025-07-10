import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import writingJson from "@/data/writing.json";

const WritingPage = dynamic(() => import("@/components/WritingPage"), {
  ssr: false,
});

/* util */
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export default function WritingDetail() {
  const { query } = useRouter();
  const { category, slug } = query as { category?: string; slug?: string };

  if (!category || !slug) return null; // 1ª render SSR

  const { intro, articles } = writingJson as any;

  /* artículo activo (o intro de reserva) */
  const article =
    articles.find((a: any) => a.category === category && a.slug === slug) ??
    intro;

  /* relacionados misma categoría */
  const related = articles
    .filter((a: any) => a.category === category && a.id !== article.id)
    .map((a: any) => ({
      label: a.title,
      href: `/writing/${a.category}/${a.slug}`,
    }));

  const categories = Array.from(
    new Set(articles.map((a: any) => a.category))
  ).sort();

  return (
    <WritingPage active={article} related={related} categories={categories} />
  );
}
