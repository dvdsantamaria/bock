import AboutPage from "@/components/AboutPage";
import { getAboutBlocks, AboutBlock } from "@/lib/about";

interface Props {
  blocks: AboutBlock[];
}

export async function getStaticProps() {
  const blocks = (await getAboutBlocks()) || [];

  if (!Array.isArray(blocks) || blocks.length === 0) {
    console.warn("No about blocks found");
    return {
      notFound: true,
    };
  }

  return {
    props: { blocks },
    revalidate: 300, // ISR – 5 min
  };
}

export default function AboutIndex({ blocks }: Props) {
  const active = blocks[0] ?? null;

  if (!active) return <div className="p-10">No content found</div>;

  return <AboutPage blocks={blocks} active={active} />;
}
