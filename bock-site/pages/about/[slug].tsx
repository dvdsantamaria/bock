import { GetStaticPaths, GetStaticProps } from "next";
import AboutPage from "@/components/AboutPage";
import { getAboutBlocks, getAboutBySlug, AboutBlock } from "@/lib/about";

interface Props {
  blocks: AboutBlock[];
  active: AboutBlock | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blocks = await getAboutBlocks();
  return {
    paths: blocks.map((b) => ({ params: { slug: b.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const [blocks, active] = await Promise.all([
    getAboutBlocks(),
    getAboutBySlug(slug),
  ]);

  if (!active) return { notFound: true, revalidate: 60 };

  return {
    props: { blocks, active },
    revalidate: 300,
  };
};

export default function AboutSlug({ blocks, active }: Props) {
  if (!active) return <div className="p-10">Loading…</div>;
  return <AboutPage blocks={blocks} active={active} />;
}
