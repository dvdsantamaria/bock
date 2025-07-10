import dynamic from "next/dynamic";
import writingJson from "@/data/writing.json";

/* dynamic import con cast */
const WritingPage = dynamic(() => import("@/components/WritingPage"), {
  ssr: false,
}) as any;

export default function WritingIndex() {
  const { intro, articles } = writingJson as any;

  const related = articles.map((a: any) => ({
    label: a.title,
    href: `/writing/${a.category}/${a.slug}`,
  }));

  const categories = Array.from(new Set(articles.map((a: any) => a.category)));

  return (
    <WritingPage active={intro} related={related} categories={categories} />
  );
}
