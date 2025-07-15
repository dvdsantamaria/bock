import WritingPage from "@/components/WritingPage";
import {
  getWritingIntro,
  getWritingArticles,
  getWritingCategories,
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
  const categories = await getWritingCategories();

  return {
    paths: categories.map((category) => ({ params: { category } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;

  const intro = await getWritingIntro();
  const articles = await getWritingArticles();

  // Encontrar el primer artículo en la categoría
  const firstInCat = articles.find((a) => a.category === category) || intro;

  // Construir lista de artículos relacionados
  const related: LinkItem[] = articles
    .filter((a) => a.category === category && a.slug !== firstInCat.slug)
    .map((a) => ({
      label: a.title,
      href: `/writing/${category}/${a.slug}`,
    }));

  const categories = await getWritingCategories();

  return {
    props: {
      active: firstInCat,
      related,
      categories,
      articles,
    },
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
