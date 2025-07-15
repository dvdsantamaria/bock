/* pages/design/[slug].tsx */
import dynamic from "next/dynamic";
import {
  getDesignIntro,
  getDesignArticles,
  getDesignSlugs,
} from "@/lib/design";

export async function getStaticPaths() {
  try {
    const slugs = await getDesignSlugs();

    return {
      paths: slugs.map((slug) => ({ params: { slug } })),
      fallback: "blocking",
    };
  } catch (error) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

export async function getStaticProps({ params }: any) {
  try {
    const slug = params.slug;
    const intro = await getDesignIntro();
    const articles = await getDesignArticles();

    const isValidSlug = articles.some((a) => a.slug === slug);
    if (!isValidSlug) return { notFound: true };

    return {
      props: {
        initialData: { intro, articles },
        initialSlug: slug,
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

const DesignPage = dynamic(() => import("@/components/DesignPage"), {
  ssr: false,
});

export default function DesignSlug({ initialData, initialSlug }: any) {
  return <DesignPage initialData={initialData} initialSlug={initialSlug} />;
}
