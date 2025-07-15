import DesignPage from "@/components/DesignPage";
import type { DesignBlock } from "@/types/design";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  blocks: DesignBlock[];
}

export async function getStaticProps() {
  const res = await fetch(`${API}/api/designs?populate=*`);
  const raw = await res.json();

  const blocks: DesignBlock[] = raw.data.map((it: any) => ({
    id: it.id,
    title: it.title,
    body: it.body || it.content,
    slug: it.slug,
  }));

  return { props: { blocks }, revalidate: 300 };
}

export default function DesignIndex({ blocks }: Props) {
  return <DesignPage blocks={blocks} active={blocks[0]} />;
}
