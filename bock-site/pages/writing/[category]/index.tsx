import WritingPage from "@/components/WritingPage";
import type { Intro, Article, LinkItem } from "@/types/writing";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  active: Intro | Article;
  related: LinkItem[];
  categories: string[];
  articles: Article[];
}

export async function getStaticPaths() {
  const res = await fetch(`${API}/api/writings?populate=Category`);
  const data = await res.json();
  const categories = Array.from(
    new Set(data.data.map((a: any) => a.Category?.slug || "uncategorised"))
  );
  return {
    paths: categories.map((cat) => ({ params: { category: cat } })),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;

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

  const firstInCat = articles.find((a) => a.category === category) ?? intro;
  const related: LinkItem[] = articles
    .filter((a) => a.category === category && a.slug !== firstInCat.slug)
    .map((a) => ({
      label: a.title,
      href: `/writing/${category}/${a.slug}`,
    }));

  const categories: string[] = Array.from(
    new Set(articles.map((a) => a.category))
  );

  return {
    props: { active: firstInCat, related, categories, articles },
    revalidate: 60,
  };
}

export default function WritingCategoryPage({
  active,
  related,
  categories,
  articles,
}: Props) {
  return (
    <WritingPage
      active={active}
      related={related}
      categories={categories}
      articles={articles}
    />
  );
}
