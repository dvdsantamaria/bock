import DesignPage from "@/components/DesignPage";
import type { DesignBlock } from "@/types/design";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  blocks: DesignBlock[];
  active: DesignBlock;
}

export async function getStaticPaths() {
  const res = await fetch(`${API}/api/designs`);
  const data = await res.json();

  const paths = data.data.map((it: any) => ({
    params: { slug: it.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const res = await fetch(`${API}/api/designs?populate=*`);
  const raw = await res.json();

  const blocks: DesignBlock[] = raw.data.map((it: any) => ({
    id: it.id,
    title: it.title,
    body: it.body || it.content,
    slug: it.slug,
  }));

  const active = blocks.find((b) => b.slug === slug) ?? blocks[0];

  return { props: { blocks, active }, revalidate: 300 };
}

export default function DesignSlugPage({ blocks, active }: Props) {
  return <DesignPage blocks={blocks} active={active} />;
}
