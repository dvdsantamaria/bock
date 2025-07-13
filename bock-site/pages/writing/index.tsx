import WritingPage from "@/components/WritingPage";
import type { Intro, Article, LinkItem } from "@/types/writing";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  intro: Intro;
  articles: Article[];
  related: LinkItem[];
  categories: string[];
}

export async function getStaticProps() {
  const introRaw = await fetch(`${API}/api/writing-intro`).then((r) =>
    r.json()
  );
  const introData = introRaw.data;
  const intro: Intro = {
    id: "intro",
    title: introData.name || introData.title,
    subtitle: introData.subtitle || null,
    body: introData.content || introData.body,
    slug: introData.slug,
    category: "intro",
  };

  const artRaw = await fetch(
    `${API}/api/writings?populate=*&pagination[pageSize]=100`
  ).then((r) => r.json());

  const articles: Article[] = artRaw.data.map((it: any) => ({
    id: it.id,
    title: it.title,
    subtitle: it.subtitle,
    body: it.body || it.content,
    slug: it.slug,
    category: it.Category?.slug || "uncategorised",
  }));

  const related: LinkItem[] = articles.map((a) => ({
    label: a.title,
    href: `/writing/${a.category}/${a.slug}`,
  }));

  const categories: string[] = Array.from(
    new Set(articles.map((a) => a.category))
  );

  return {
    props: { intro, articles, related, categories },
    revalidate: 60,
  };
}

export default function WritingIndex({
  intro,
  articles,
  related,
  categories,
}: Props) {
  return (
    <WritingPage
      active={intro}
      related={related}
      categories={categories}
      articles={articles}
    />
  );
}
