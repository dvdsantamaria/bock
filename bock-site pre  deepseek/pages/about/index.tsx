import AboutPage from "@/components/AboutPage";
import type { AboutBlock, LinkItem } from "@/types/about";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  blocks: AboutBlock[];
}

export async function getStaticProps() {
  const res = await fetch(`${API}/api/abouts?populate=*`);
  const raw = await res.json();

  const blocks: AboutBlock[] = raw.data.map((it: any) => ({
    id: it.id,
    title: it.title,
    body: it.body || it.content,
    slug: it.slug,
  }));

  return { props: { blocks }, revalidate: 300 };
}

export default function AboutIndex({ blocks }: Props) {
  return <AboutPage blocks={blocks} active={blocks[0]} />;
}
