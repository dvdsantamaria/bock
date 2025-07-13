import PhotographyPage from "@/components/PhotographyPage";
import type { PhotoItem } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  blocks: PhotoItem[];
  active: PhotoItem;
}

export async function getStaticPaths() {
  const res = await fetch(`${API}/api/photos`);
  const data = await res.json();

  const paths = data.data.map((it: any) => ({
    params: { slug: it.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const { slug } = params;

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

  const active = blocks.find((b) => b.slug === slug) ?? blocks[0];

  return { props: { blocks, active }, revalidate: 300 };
}

export default function PhotographySlugPage({ blocks, active }: Props) {
  return <PhotographyPage blocks={blocks} active={active} />;
}
