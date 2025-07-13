import WritingPage from "@/components/WritingPage";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export async function getStaticPaths() {
  // Trae todas las categorías únicas desde Strapi
  const res = await fetch(`${API}/api/writings?populate=Category`);
  const data = await res.json();

  const categories = Array.from(
    new Set(data.data.map((a: any) => a.Category?.slug || "uncategorised"))
  );

  const paths = categories.map((category) => ({
    params: { category },
  }));

  return { paths, fallback: false }; // solo pre-renderiza lo que existe
}

export async function getStaticProps({ params }: any) {
  const category = params.category;

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

  const firstInCat = articles.find((a) => a.category === category) ?? intro;

  const related = articles
    .filter((a) => a.category === category && a.slug !== firstInCat.slug)
    .map((a) => ({
      label: a.title,
      href: `/writing/${category}/${a.slug}`,
    }));

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return {
    props: {
      active: firstInCat,
      related,
      categories,
      articles,
    },
    revalidate: 60, // vuelve a generar si cambia algo
  };
}

export default function WritingCategoryPage({
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
