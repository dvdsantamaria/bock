import WritingPage from "@/components/WritingPage";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export async function getStaticProps() {
  // Fetch intro
  const introRaw = await fetch(`${API}/api/writing-intro`).then((res) =>
    res.json()
  );

  const introData = introRaw.data;
  const intro = {
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

  const articles = artRaw.data.map((it: any) => ({
    id: it.id,
    title: it.title,
    subtitle: it.subtitle,
    body: it.body || it.content,
    slug: it.slug,
    category: it.Category?.slug || "uncategorised",
  }));

  const related = articles.map((a: any) => ({
    label: a.title,
    href: `/writing/${a.category}/${a.slug}`,
  }));

  const categories = Array.from(new Set(articles.map((a: any) => a.category)));

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
}: any) {
  return (
    <WritingPage
      active={intro}
      related={related}
      categories={categories}
      articles={articles}
    />
  );
}
