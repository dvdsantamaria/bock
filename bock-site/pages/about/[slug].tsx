// pages/about/[slug].tsx
import dynamic from "next/dynamic";
import { getAboutIntro, getAboutArticles, getAboutSlugs } from "@/lib/about";

export async function getStaticPaths() {
  try {
    const slugs = await getAboutSlugs();

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
    const intro = await getAboutIntro();
    const articles = await getAboutArticles();

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

const AboutSection = dynamic(() => import("@/components/AboutPage"), {
  ssr: false,
});

export default function AboutSlug({ initialData, initialSlug }: any) {
  return <AboutSection initialData={initialData} initialSlug={initialSlug} />;
}
