import WritingPage from "@/components/WritingPage";
import type { Intro, Article, LinkItem } from "@/types/writing";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Article {
  id: number;
  title: string;
  subtitle?: string;
  body: any;
  slug: string;
  category: string;
}

interface Intro extends Article {
  id: "intro";
  category: "intro";
}

interface LinkItem {
  label: string;
  href: string;
}

interface Props {
  active: Article | Intro;
  related: LinkItem[];
  categories: string[];
  articles: Article[];
}

interface Params {
  category: string;
  slug: string;
}

export async function getStaticPaths() {
  const res = await fetch(`${API}/api/writings?populate=Category`);
  const data = await res.json();

  const paths = data.data.map((item: any) => ({
    params: {
      category: item.Category?.slug || "uncategorised",
      slug: item.slug,
    },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: Params }) {
  const { category, slug } = params;

  // Intro
  const introRaw = await fetch(`${API}/api/writing-intro`).then((res) =>
    res.json()
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

  // Articles
  const artRaw = await fetch(
    `${API}/api/writings?populate=*&pagination[pageSize]=100`
  ).then((res) => res.json());

  const articles: Article[] = artRaw.data.map((it: any) => ({
    id: it.id,
    title: it.title,
    subtitle: it.subtitle,
    body: it.body || it.content,
    slug: it.slug,
    category: it.Category?.slug || "uncategorised",
  }));

  const article =
    articles.find((a) => a.slug === slug && a.category === category) ?? intro;

  const related: LinkItem[] = articles
    .filter((a) => a.category === category && a.slug !== slug)
    .map((a) => ({
      label: a.title,
      href: `/writing/${a.category}/${a.slug}`,
    }));

  const categories: string[] = Array.from(
    new Set(articles.map((a) => a.category))
  );

  return {
    props: {
      active: article,
      related,
      categories,
      articles,
    },
    revalidate: 60,
  };
}

export default function WritingDetailPage({
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
