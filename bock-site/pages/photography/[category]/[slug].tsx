// pages/photography/[category]/[slug].tsx
import type { GetStaticPaths, GetStaticProps } from "next";
import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  active: PhotographyBlock | null;
  blocks: PhotographyBlock[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(
    `${API}/api/photographies?populate[Category][fields][0]=slug`
  );
  const json = await res.json();

  const paths = Array.isArray(json.data)
    ? json.data
        .filter(
          (it: any) =>
            it?.attributes?.Category?.data?.attributes?.slug &&
            it?.attributes?.slug
        )
        .map((it: any) => ({
          params: {
            category: it.attributes.Category.data.attributes.slug,
            slug: it.attributes.slug,
          },
        }))
    : [];

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  // bloque activo
  const r1 = await fetch(
    `${API}/api/photographies?filters[slug][$eq]=${slug}&populate[Category][fields][0]=slug&populate[imageThumb][fields][0]=url&populate[imageFull][fields][0]=url`
  );
  const json1 = await r1.json();

  if (!json1?.data?.length) return { notFound: true, revalidate: 60 };

  const it = json1.data[0];
  const attr = it?.attributes;

  const active: PhotographyBlock = {
    id: it.id,
    title: attr?.title ?? "",
    subtitle: attr?.subtitle ?? "",
    body: attr?.body || attr?.content || "",
    slug: attr?.slug ?? "",
    category: attr?.Category?.data?.attributes?.slug || "uncategorised",
    imageThumb: attr?.imageThumb?.data?.attributes?.url
      ? `${API}${attr.imageThumb.data.attributes.url}`
      : undefined,
    imageFull: attr?.imageFull?.data?.attributes?.url
      ? `${API}${attr.imageFull.data.attributes.url}`
      : undefined,
  };

  // todos los bloques (para la galería inferior)
  const r2 = await fetch(
    `${API}/api/photographies?populate=Category,imageThumb,imageFull&pagination[pageSize]=100`
  );
  const json2 = await r2.json();

  const blocks: PhotographyBlock[] = Array.isArray(json2.data)
    ? json2.data
        .filter((p: any) => p?.attributes?.Category?.data)
        .map((p: any) => {
          const a = p.attributes;
          return {
            id: p.id,
            title: a.title ?? "",
            subtitle: a.subtitle ?? "",
            body: a.body || a.content || "",
            slug: a.slug,
            category: a.Category?.data?.attributes?.slug || "uncategorised",
            imageThumb: a.imageThumb?.data?.attributes?.url
              ? `${API}${a.imageThumb.data.attributes.url}`
              : undefined,
            imageFull: a.imageFull?.data?.attributes?.url
              ? `${API}${a.imageFull.data.attributes.url}`
              : undefined,
          };
        })
    : [];

  return {
    props: { active, blocks },
    revalidate: 300,
  };
};

export default function PhotographySlug({ active, blocks }: Props) {
  if (!active) return <div className="p-10">Photo not found.</div>;
  return <PhotographyPage blocks={blocks} active={active} />;
}
