import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export async function getStaticPaths() {
  const res = await fetch(`${API}/api/photographies?populate=Category`);
  const data = await res.json();

  const paths = data.data.map((it: any) => ({
    params: {
      category: it.Category?.slug || "uncategorised",
      slug: it.slug,
    },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: any) {
  const { category, slug } = params;

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

  const active =
    blocks.find((p) => p.slug === slug && p.category === category) ?? blocks[0];

  return { props: { blocks, active }, revalidate: 300 };
}

export default PhotographyPage;
