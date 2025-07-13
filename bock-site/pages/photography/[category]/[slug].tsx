// pages/photography/[category]/[slug].tsx
import type { GetStaticPaths, GetStaticProps } from "next";
import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  active: PhotographyBlock | null;
  blocks: PhotographyBlock[];
}
/*  -------- paths --------  */
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await fetch(
    `${API}/api/photographies` + `?populate[Category][fields][0]=slug`
  ).then((r) => r.json());

  const paths =
    data
      ?.filter((it: any) => it.attributes?.Category?.data)
      .map((it: any) => ({
        params: {
          category: it.attributes.Category.data.attributes.slug,
          slug: it.attributes.slug,
        },
      })) ?? [];

  return { paths, fallback: "blocking" };
};

/*  -------- props (ISR) --------  */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params!.slug as string;

  /* ► foto activa */
  const { data: activeArr } = await fetch(
    `${API}/api/photographies` +
      `?filters[slug][$eq]=${slug}` +
      `&populate[Category][fields][0]=slug` +
      `&populate[imageThumb][fields][0]=url` +
      `&populate[imageFull][fields][0]=url`
  ).then((r) => r.json());

  if (!activeArr?.length) return { notFound: true, revalidate: 60 };

  const it = activeArr[0];
  const a = it.attributes;
  const active: PhotographyBlock = {
    id: it.id,
    title: a.title,
    subtitle: a.subtitle ?? "",
    body: a.body ?? a.content ?? "",
    slug: a.slug,
    category: a.Category?.data?.attributes?.slug ?? "uncategorised",
    imageThumb: a.imageThumb?.data?.attributes?.url
      ? `${API}${a.imageThumb.data.attributes.url}`
      : undefined,
    imageFull: a.imageFull?.data?.attributes?.url
      ? `${API}${a.imageFull.data.attributes.url}`
      : undefined,
  };

  /* ► todas (para la tira de thumbs) */
  const { data: list } = await fetch(
    `${API}/api/photographies` +
      `?pagination[pageSize]=100` +
      `&populate[Category][fields][0]=slug` +
      `&populate[imageThumb][fields][0]=url` +
      `&populate[imageFull][fields][0]=url`
  ).then((r) => r.json());

  const blocks: PhotographyBlock[] =
    list
      ?.filter((p: any) => p.attributes?.Category?.data)
      .map((p: any) => {
        const x = p.attributes;
        return {
          id: p.id,
          title: x.title,
          subtitle: x.subtitle ?? "",
          body: x.body ?? x.content ?? "",
          slug: x.slug,
          category: x.Category.data.attributes.slug ?? "uncategorised",
          imageThumb: x.imageThumb?.data?.attributes?.url
            ? `${API}${x.imageThumb.data.attributes.url}`
            : undefined,
          imageFull: x.imageFull?.data?.attributes?.url
            ? `${API}${x.imageFull.data.attributes.url}`
            : undefined,
        };
      }) ?? [];

  return { props: { active, blocks }, revalidate: 300 };
};

export default function PhotographySlug({ active, blocks }: Props) {
  if (!active) return <div className="p-10">Photo not found.</div>;
  return <PhotographyPage blocks={blocks} active={active} />;
}
