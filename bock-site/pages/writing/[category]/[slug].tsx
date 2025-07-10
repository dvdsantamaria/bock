import { useRouter } from "next/router";
import writingJson from "@/data/writing.json";
import WritingPage, { WritingJson } from "@/components/WritingPage";

const toSlug = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export default function WritingDetail() {
  const router = useRouter();
  const { category, slug } = router.query as {
    category?: string;
    slug?: string;
  };

  const { intro, articles } = writingJson as unknown as WritingJson;

  if (!category || !slug) return null; // SSR / 404 fallback

  const article =
    articles.find((w) => w.category === category && toSlug(w.slug) === slug) ??
    intro;

  const related = articles
    .filter((a) => a.category === category && a.id !== article.id)
    .map((a) => ({ label: a.title, href: `/writing/${a.category}/${a.slug}` }));

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <WritingPage
      json={writingJson as any}
      active={article}
      related={related}
      categories={categories}
    />
  );
}
