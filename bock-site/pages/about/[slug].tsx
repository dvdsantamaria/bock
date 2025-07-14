// pages/about/[slug].tsx
import { GetStaticProps, GetStaticPaths } from "next";
import dynamic from "next/dynamic";
import {
  fetchIntro,
  fetchArticles,
  getAllSlugs,
  Intro,
  Article,
} from "@/lib/about";

const AboutSection = dynamic(() => import("@/components/AboutPage"));

interface Props {
  intro: Intro;
  articles: Article[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      intro: await fetchIntro(),
      articles: await fetchArticles(), // AboutPage filtra por router.slug
    },
    revalidate: 300,
  };
};

export default function AboutSlug({ intro, articles }: Props) {
  return <AboutSection intro={intro} initialArticles={articles} />;
}
