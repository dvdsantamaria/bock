import AboutPage from "@/components/AboutPage";
import { getAboutBlocks, AboutBlock } from "@/lib/about";

interface Props {
  blocks: AboutBlock[];
}

export async function getStaticProps() {
  const blocks = await getAboutBlocks();
  return {
    props: { blocks },
    revalidate: 300, // ISR – 5 min
  };
}

export default function AboutIndex({ blocks }: Props) {
  // Mantenemos el layout original de AboutPage
  return <AboutPage blocks={blocks} active={blocks[0]} />;
}
