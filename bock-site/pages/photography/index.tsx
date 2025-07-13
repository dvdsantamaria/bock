import PhotographyPage from "@/components/PhotographyPage";
import type { PhotoItem } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  blocks: PhotoItem[];
}

export async function getStaticProps() {
  const res = await fetch(`${API}/api/photos?populate=*`);
  const raw = await res.json();

  const blocks: PhotoItem[] = raw.data.map((it: any) => ({
    id: it.id,
    title: it.title,
    subtitle: it.subtitle,
    body: it.body || it.content,
    slug: it.slug,
    imageThumb: it.imageThumb?.url ? `${API}${it.imageThumb.url}` : undefined,
    imageFull: it.imageFull?.url ? `${API}${it.imageFull.url}` : undefined,
  }));

  return { props: { blocks }, revalidate: 300 };
}

export default function PhotographyIndex({ blocks }: Props) {
  return <PhotographyPage blocks={blocks} active={blocks[0]} />;
}
