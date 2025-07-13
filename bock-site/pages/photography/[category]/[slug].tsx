/* pages/photography/[category]/[slug].tsx
   – Construye todas las rutas en build (SSG) y revalida cada 5 min. */

import type { GetStaticPaths, GetStaticProps } from "next";
import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/* ---------- SSG: rutas ---------- */
export const getStaticPaths: GetStaticPaths = async () => {
  /* Pedimos SOLO los slugs + categoría para todas las fotos */
  const res = await fetch(
    `${API}/api/photographies?populate=Category&pagination[pageSize]=1000&fields=slug`
  );
  const json = await res.json();

  const paths =
    Array.isArray(json.data) && json.data.length
      ? json.data.map((it: any) => ({
          params: {
            category:
              it.attributes.Category?.data?.attributes?.slug ?? "uncategorised",
            slug: it.attributes.slug,
          },
        }))
      : [];

  return { paths, fallback: "blocking" };
};

/* ---------- SSG: datos de la página ---------- */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { category, slug } = params as {
    category: string;
    slug: string;
  };

  /* Traemos TODAS las fotos (para sidebar/relacionados)           */
  /* Podrías paginar aquí si la colección crece mucho.             */
  const allRes = await fetch(
    `${API}/api/photographies?populate=Category,imageThumb,imageFull&pagination[pageSize]=1000`
  );
  const allJson = await allRes.json();

  const all: PhotographyBlock[] = Array.isArray(allJson.data)
    ? allJson.data.map((it: any) => {
        const a = it.attributes;
        return {
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
      })
    : [];

  /* Buscamos el bloque que coincide con slug & category */
  const block =
    all.find((p) => p.slug === slug && p.category === category) ?? null;

  if (!block) {
    /* Si Strapi no lo devuelve => 404 en build y runtime */
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: {
      block,
      blocks: all,
    },
    revalidate: 300, // 5 min – se vuelve a generar en segundo plano
  };
};

/* ---------- Componente de la página ---------- */
interface Props {
  block: PhotographyBlock;
  blocks: PhotographyBlock[];
}

export default function PhotographySlugPage({ block, blocks }: Props) {
  /* Pasamos la foto actual como `active` y toda la lista para sidebar */
  return <PhotographyPage active={block} blocks={blocks} />;
}
