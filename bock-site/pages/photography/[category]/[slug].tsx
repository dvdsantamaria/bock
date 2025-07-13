import type { GetStaticPaths, GetStaticProps } from "next";
import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  active: PhotographyBlock | null;
  blocks: PhotographyBlock[];
}

/* -------- getStaticPaths (ISR) -------- */
export const getStaticPaths: GetStaticPaths = async () => {
  const r = await fetch(
    `${API}/api/photographies?populate[Category][fields][0]=slug`
  ).then((x) => x.json());

  const paths =
    r?.data
      ?.filter((it: any) => it.attributes?.Category?.data)
      .map((it: any) => ({
        params: {
          category: it.attributes.Category.data.attributes.slug,
          slug: it.attributes.slug,
        },
      })) || [];

  return { paths, fallback: "blocking" };
};

/* -------- getStaticProps (ISR) -------- */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  // 1️⃣  Entry individual
  const r1 = await fetch(
    `${API}/api/photographies?filters[slug][$eq]=${slug}&populate=*`
  ).then((r) => r.json());

  if (!r1?.data?.length) {
    return {
      notFound: true,
    };
  }

  const it = r1.data[0];
  const active: PhotographyBlock = {
    id: it.id,
    title: it.attributes.title,
    subtitle: it.attributes.subtitle,
    body: it.attributes.body || it.attributes.content || "",
    slug: it.attributes.slug,
    category: it.attributes.Category?.data?.attributes?.slug || "uncategorised",
    imageThumb: it.attributes.imageThumb?.data?.attributes?.url
      ? `${API}${it.attributes.imageThumb.data.attributes.url}`
      : undefined,
    imageFull: it.attributes.imageFull?.data?.attributes?.url
      ? `${API}${it.attributes.imageFull.data.attributes.url}`
      : undefined,
  };

  // 2️⃣  Sidebar / thumbnails
  const r2 = await fetch(
    `${API}/api/photographies` +
      `?pagination[pageSize]=100` +
      `&populate[Category][fields][0]=slug` +
      `&populate[imageThumb][fields][0]=url` +
      `&populate[imageFull][fields][0]=url`
  ).then((x) => x.json());

  const blocks: PhotographyBlock[] =
    r2?.data
      ?.filter((p: any) => p.attributes?.Category?.data)
      .map((p: any) => ({
        id: p.id,
        title: p.attributes.title,
        subtitle: p.attributes.subtitle,
        body: p.attributes.body || p.attributes.content || "",
        slug: p.attributes.slug,
        category: p.attributes.Category.data.attributes.slug || "uncategorised",
        imageThumb: p.attributes.imageThumb?.data?.attributes?.url
          ? `${API}${p.attributes.imageThumb.data.attributes.url}`
          : undefined,
        imageFull: p.attributes.imageFull?.data?.attributes?.url
          ? `${API}${p.attributes.imageFull.data.attributes.url}`
          : undefined,
      })) || [];

  return { props: { active, blocks }, revalidate: 300 };
};

/* -------- page -------- */
export default function PhotographySlug({ active, blocks }: Props) {
  if (!active) return <div className="p-10">Photo not found</div>;
  return <PhotographyPage blocks={blocks} active={active} />;
}
