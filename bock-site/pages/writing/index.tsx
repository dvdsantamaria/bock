// pages/writing/index.tsx
import WritingPage from "@/components/WritingPage";
import {
  getWritingIntro,
  getWritingArticles,
  getWritingCategories,
  type Intro,
  type Article,
  type LinkItem,
} from "@/lib/writing";

interface Props {
  intro: Intro;
  articles: Article[];
  related: LinkItem[];
  categories: string[];
}

export async function getStaticProps() {
  try {
    const intro = await getWritingIntro();
    const articles = await getWritingArticles();
    const categories = await getWritingCategories();

    const related: LinkItem[] = articles.map((a) => ({
      label: a.title,
      href: `/writing/${a.category}/${a.slug}`,
    }));

    return {
      props: {
        intro,
        articles,
        related,
        categories,
      },
      revalidate: 60, // ISR cada 60 segundos
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        intro: {
          id: "intro",
          title: "Writing",
          subtitle: null,
          body: null,
          slug: "intro",
          category: "intro",
        },
        articles: [],
        related: [],
        categories: [],
      },
      revalidate: 10, // Reintentar más pronto si hay error
    };
  }
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
