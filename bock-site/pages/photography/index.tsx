import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  blocks: PhotographyBlock[];
}

export async function getStaticProps() {
  const res = await fetch(
    `${API}/api/photographies?populate=Category,imageThumb,imageFull`
  );
  const raw = await res.json();

  if (!Array.isArray(raw.data)) {
    return { props: { blocks: [] }, revalidate: 300 };
  }

  const blocks: PhotographyBlock[] = raw.data
    .filter((it: any) => it && it.slug && it.title)
    .map((it: any) => ({
      id: it.id,
      title: it.title,
      subtitle: it.subtitle,
      body: it.body || it.content,
      slug: it.slug,
      imageThumb: it.imageThumb?.url ? `${API}${it.imageThumb.url}` : undefined,
      imageFull: it.imageFull?.url ? `${API}${it.imageFull.url}` : undefined,
      category: it.Category?.slug || "uncategorised", // ✅ se agregó este campo
    }));

  return { props: { blocks }, revalidate: 300 };
}

export default function PhotographyIndex({ blocks }: Props) {
  if (!blocks.length) {
    return <div>No photos found or failed to load data.</div>;
  }

  return <PhotographyPage blocks={blocks} active={blocks[0]} />;
}
