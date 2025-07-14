// pages/about/index.tsx
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { fetchIntro, fetchArticles, Intro, Article } from "@/lib/about";

const AboutSection = dynamic(() => import("@/components/AboutPage")); // SSR activo

interface Props {
  intro: Intro;
  articles: Article[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      intro: await fetchIntro(),
      articles: await fetchArticles(),
    },
    revalidate: 300, // 5 min
  };
};

export default function AboutIndex({ intro, articles }: Props) {
  return <AboutSection intro={intro} initialArticles={articles} />;
}
