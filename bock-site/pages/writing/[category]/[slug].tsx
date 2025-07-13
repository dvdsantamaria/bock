import WritingPage from "@/components/WritingPage";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

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

export async function getStaticProps({ params }: any) {
  const { category, slug } = params;

  // Intro
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

  // Articles
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

  const article =
    articles.find((a) => a.slug === slug && a.category === category) ?? intro;

  const related = articles
    .filter((a) => a.category === category && a.slug !== slug)
    .map((a) => ({
      label: a.title,
      href: `/writing/${a.category}/${a.slug}`,
    }));

  const categories = Array.from(new Set(articles.map((a) => a.category)));

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
}: any) {
  return (
    <WritingPage
      active={active}
      related={related}
      categories={categories}
      articles={articles}
    />
  );
}
