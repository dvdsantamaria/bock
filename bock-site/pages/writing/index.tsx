import WritingPage from "@/components/WritingPage";

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
  intro: Intro;
  articles: Article[];
  related: LinkItem[];
  categories: string[];
}

export async function getStaticProps() {
  // Fetch intro
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

  // Fetch articles
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

  const related: LinkItem[] = articles.map((a) => ({
    label: a.title,
    href: `/writing/${a.category}/${a.slug}`,
  }));

  const categories: string[] = Array.from(
    new Set(articles.map((a) => a.category))
  );

  return {
    props: {
      intro,
      articles,
      related,
      categories,
    },
    revalidate: 60, // cada 60 segundos refresca cache en background
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
