import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  blocks: PhotographyBlock[];
}

export async function getStaticProps() {
  const res = await fetch(`${API}/api/photos?populate=*`);
  const raw = await res.json();

  const blocks: PhotographyBlock[] =
    raw.data?.map((it: any) => ({
      slug: it.attributes.slug,
      title: it.attributes.title,
      subtitle: it.attributes.subtitle,
      body: it.attributes.body || it.attributes.content,
      imageThumb: it.attributes.imageThumb?.data?.attributes?.url
        ? `${API}${it.attributes.imageThumb.data.attributes.url}`
        : undefined,
      imageFull: it.attributes.imageFull?.data?.attributes?.url
        ? `${API}${it.attributes.imageFull.data.attributes.url}`
        : undefined,
    })) ?? [];

  return { props: { blocks }, revalidate: 300 };
}

// ✅ React component must be exported as default
export default function PhotographyIndex({ blocks }: Props) {
  const active = blocks[0];
  return <PhotographyPage blocks={blocks} active={active} />;
}
