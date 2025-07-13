import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  blocks: PhotographyBlock[];
}

export async function getStaticProps() {
  try {
    const res = await fetch(`${API}/api/photos?populate=*`);
    const raw = await res.json();

    if (!raw?.data || !Array.isArray(raw.data)) {
      throw new Error("Invalid or empty data from /api/photos");
    }

    const blocks: PhotographyBlock[] = raw.data.map((it: any) => ({
      id: it.id,
      title: it.attributes?.title || it.title,
      subtitle: it.attributes?.subtitle || it.subtitle,
      body: it.attributes?.body || it.body || it.content,
      slug: it.attributes?.slug || it.slug,
      imageThumb: it.attributes?.imageThumb?.url
        ? `${API}${it.attributes.imageThumb.url}`
        : undefined,
      imageFull: it.attributes?.imageFull?.url
        ? `${API}${it.attributes.imageFull.url}`
        : undefined,
    }));

    return { props: { blocks }, revalidate: 300 };
  } catch (err) {
    console.error("Error in getStaticProps /photography:", err);
    return { notFound: true };
  }
}
