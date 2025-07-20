import WritingPage from "@/components/WritingPage";
import {
  getWritingIntro,
  getWritingArticles,
  getWritingCategories,
  getWritingSlugs,
  Article,
  Intro,
  LinkItem,
} from "@/lib/writing";

interface Props {
  active: Intro | Article;
  related: LinkItem[];
  categories: string[];
  articles: Article[];
}

export async function getStaticPaths() {
  const slugs = await getWritingSlugs();

  return {
    paths: slugs.map(({ category, slug }) => ({
      params: { category, slug },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const { category, slug } = params;

  const intro = await getWritingIntro();
  const articles = await getWritingArticles();

  // Buscar artículo por slug y category
  const article =
    articles.find((a) => a.slug === slug && a.category === category) || null;

  // Si no se encuentra, podés devolver notFound o mostrar intro
  if (!article) {
    // return { notFound: true }; // Esta es la opción estricta
    return {
      props: {
        active: intro,
        related: [],
        categories: await getWritingCategories(),
        articles,
      },
      revalidate: 60,
    };
  }

  // Artículos relacionados (mismo category, distinto slug)
  const related: LinkItem[] = articles
    .filter((a) => a.category === category && a.slug !== slug)
    .map((a) => ({
      label: a.title,
      href: `/writing/${category}/${a.slug}`,
    }));

  const categories = await getWritingCategories();

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
