// pages/about/index.tsx
import { getAboutIntro, getAboutArticles } from "@/lib/about";
import dynamic from "next/dynamic"; // <- ESTA LINEA

export async function getStaticProps() {
  const intro = await getAboutIntro();
  const articles = await getAboutArticles();

  return {
    props: {
      initialData: { intro, articles },
    },
    revalidate: 60, // ISR: regeneración cada 60 segundos
  };
}

// Mantener importación dinámica
const AboutSection = dynamic(() => import("@/components/AboutPage"), {
  ssr: false,
});

export default function AboutIndex({ initialData }: any) {
  return <AboutSection initialData={initialData} />;
}
