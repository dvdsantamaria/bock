import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export async function getStaticProps() {
  const res = await fetch(
    `${API}/api/photographies?populate=Category,imageThumb,imageFull&pagination[pageSize]=100`
  ).then((r) => r.json());

  const blocks: PhotographyBlock[] = res.data.map((it: any) => ({
    id: it.id,
    title: it.title,
    subtitle: it.subtitle,
    body: it.body || it.content,
    slug: it.slug,
    category: it.Category?.slug || "uncategorised",
    imageThumb: it.imageThumb?.url ? `${API}${it.imageThumb.url}` : undefined,
    imageFull: it.imageFull?.url ? `${API}${it.imageFull.url}` : undefined,
  }));

  return { props: { blocks }, revalidate: 300 };
}

export default function PhotographyIndex({
  blocks,
}: {
  blocks: PhotographyBlock[];
}) {
  return <PhotographyPage blocks={blocks} active={blocks[0]} />;
}
