// pages/about/[slug].tsx
import { getAboutIntro, getAboutArticles, getAboutSlugs } from "@/lib/about";
import dynamic from "next/dynamic"; // <- ESTA LINEA

export async function getStaticPaths() {
  const slugs = await getAboutSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }: any) {
  const slug = params.slug;
  const intro = await getAboutIntro();
  const articles = await getAboutArticles();

  // Verificar si el slug existe
  const isValidSlug = articles.some((a) => a.slug === slug);
  if (!isValidSlug) return { notFound: true };

  return {
    props: {
      initialData: { intro, articles },
      initialSlug: slug,
    },
    revalidate: 60, // ISR
  };
}

// Mantener importación dinámica
const AboutSection = dynamic(() => import("@/components/AboutPage"), {
  ssr: false,
});

export default function AboutSlug({ initialData, initialSlug }: any) {
  return <AboutSection initialData={initialData} initialSlug={initialSlug} />;
}
