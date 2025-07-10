import { useRouter } from "next/router";
import writingJson from "@/data/writing.json";
import dynamic from "next/dynamic";

/* carga diferida */
const WritingPage = dynamic(() => import("@/components/WritingPage"), {
  ssr: false,
}) as any; //  ←  🟢 permitimos props extra

const toSlug = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export default function WritingDetail() {
  const { query } = useRouter();
  const { category, slug } = query as { category?: string; slug?: string };

  if (!category || !slug) return null;

  const { intro, articles } = writingJson as any;

  const article =
    articles.find((a: any) => a.slug === slug && a.category === category) ??
    intro;

  const related = articles
    .filter((a: any) => a.category === category && a.slug !== slug)
    .map((a: any) => ({
      label: a.title,
      href: `/writing/${a.category}/${a.slug}`,
    }));

  const categories = Array.from(new Set(articles.map((a: any) => a.category)));

  return (
    <WritingPage active={article} related={related} categories={categories} />
  );
}
