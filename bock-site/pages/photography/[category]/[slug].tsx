import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import MainLayout from "@/components/MainLayout";
import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  blocks: PhotographyBlock[];
  slug: string;
  category: string;
}

export default function PhotographySlug({ blocks, slug, category }: Props) {
  const theme = {
    background: "#fff",
    accent: "#E74C3C",
    menuText: "#000",
    menuHover: "#E74C3C",
    logoText: "#000",
    sectionColor: "#808080",
  };

  const active = blocks.find((b) => b.slug === slug) || blocks[0];

  if (!blocks || blocks.length === 0 || !active) {
    return (
      <MainLayout section="photography" theme={theme}>
        <p className="p-8 text-center">No content found.</p>
      </MainLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{active.title}</title>
      </Head>

      <MainLayout
        section="photography"
        subMenuItems={blocks.map((b) => b.title)}
        theme={theme}
      >
        <PhotographyPage blocks={blocks} active={active} />
      </MainLayout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${API}/api/photography-pages?populate=*`);
  const json = await res.json();

  const paths =
    json.data?.flatMap((item: any) =>
      item.attributes.blocks?.map((b: any) => ({
        params: {
          category: item.attributes.slug,
          slug: b.slug,
        },
      }))
    ) || [];

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;
  const slug = params?.slug as string;

  const res = await fetch(
    `${API}/api/photography-pages?filters[slug][$eq]=${category}&populate[blocks][populate]=*`
  );

  if (!res.ok) {
    return { notFound: true };
  }

  const json = await res.json();
  const page = json.data?.[0];
  const blocks = page?.attributes?.blocks || [];

  if (!blocks || blocks.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      blocks,
      slug,
      category,
    },
  };
};
