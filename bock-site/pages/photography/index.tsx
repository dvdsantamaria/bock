import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  blocks: PhotographyBlock[];
}

export async function getStaticProps() {
  try {
    const r = await fetch(
      `${API}/api/photographies?pagination[pageSize]=100&populate[Category][fields][0]=slug&populate[imageThumb][fields][0]=url&populate[imageFull][fields][0]=url`
    ).then((x) => x.json());

    const blocks: PhotographyBlock[] =
      r?.data?.map((it: any) => ({
        id: it.id,
        title: it.attributes.title,
        subtitle: it.attributes.subtitle,
        body: it.attributes.body || it.attributes.content || "",
        slug: it.attributes.slug,
        category:
          it.attributes.Category?.data?.attributes?.slug || "uncategorised",
        imageThumb: it.attributes.imageThumb?.data?.attributes?.url
          ? `${API}${it.attributes.imageThumb.data.attributes.url}`
          : undefined,
        imageFull: it.attributes.imageFull?.data?.attributes?.url
          ? `${API}${it.attributes.imageFull.data.attributes.url}`
          : undefined,
      })) || [];

    return { props: { blocks }, revalidate: 300 };
  } catch (e) {
    console.error("photography SSG error:", e);
    return { props: { blocks: [] }, revalidate: 60 };
  }
}

export default function PhotographyIndex({ blocks }: Props) {
  if (!blocks.length) return <div className="p-10">No photos found.</div>;
  return <PhotographyPage blocks={blocks} active={blocks[0]} />;
}
