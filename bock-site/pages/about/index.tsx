// pages/about/index.tsx
import dynamic from "next/dynamic";
import { getAboutIntro, getAboutArticles } from "@/lib/about";

export async function getStaticProps() {
  try {
    const intro = await getAboutIntro();
    const articles = await getAboutArticles();

    return {
      props: {
        initialData: { intro, articles },
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        initialData: {
          intro: {
            title: "About",
            subtitle: null,
            body: null,
            heroImage: null,
          },
          articles: [],
        },
      },
      revalidate: 10,
    };
  }
}

const AboutSection = dynamic(() => import("@/components/AboutPage"), {
  ssr: false,
});

export default function AboutIndex({ initialData }: any) {
  return <AboutSection initialData={initialData} />;
}
