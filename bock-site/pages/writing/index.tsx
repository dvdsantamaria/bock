import writingJson from "@/data/writing.json";
import WritingPage, { Writing, WritingJson } from "@/components/WritingPage";

/* ── destruc. JSON ── */
const { intro, articles } = writingJson as unknown as WritingJson;

export default function WritingIndex() {
  /* related = todos los artículos */
  const related = articles.map((w) => ({
    label: w.title,
    href: `/writing/${w.category}/${w.slug}`,
  }));

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <WritingPage
      json={writingJson as any}
      active={intro}
      related={related}
      categories={categories}
    />
  );
}
