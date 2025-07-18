import type { GetStaticPaths, GetStaticProps } from "next";
import DesignPage from "@/components/DesignPage";
import {
  getDesignIntro,
  getDesignArticles,
  getDesignSlugs,
} from "@/lib/design";
import type { Intro, Design } from "@/lib/design";

interface Props {
  initialData: {
    intro: Intro;
    articles: Design[];
  };
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getDesignSlugs();

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    const intro = await getDesignIntro();
    const articles = await getDesignArticles();

    return {
      props: {
        initialData: { intro, articles },
        slug,
      },
      revalidate: 60,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default function DesignSlugPage({ initialData, slug }: Props) {
  return <DesignPage initialData={initialData} initialSlug={slug} />;
}
