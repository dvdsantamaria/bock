/* pages/photography/[category]/[slug].tsx
   Páginas de detalle para cada foto                                       */

import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import type { PhotographyBlock } from "@/types/photography";
import { useRouter } from "next/router";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/* ------------- helpers ------------- */
const mapItem = (it: any): PhotographyBlock => {
  const at = it?.attributes ?? it; // v5 usa .attributes, v4 no
  return {
    id: it.id,
    title: at.title ?? "",
    subtitle: at.subtitle ?? "",
    body: at.body ?? at.content ?? "",
    slug: at.slug ?? "",
    category:
      at.Category?.data?.attributes?.slug ??
      at.Category?.slug ??
      "uncategorised",
    imageThumb: at.imageThumb?.data?.attributes?.url
      ? `${API}${at.imageThumb.data.attributes.url}`
      : at.imageThumb?.url
      ? `${API}${at.imageThumb.url}`
      : undefined,
    imageFull: at.imageFull?.data?.attributes?.url
      ? `${API}${at.imageFull.data.attributes.url}`
      : at.imageFull?.url
      ? `${API}${at.imageFull.url}`
      : undefined,
  };
};

/* ------------- página ------------- */
interface Props {
  photo: PhotographyBlock | null;
  all: PhotographyBlock[]; // para el listado lateral (si lo necesitas)
}

export default function PhotographySlugPage({ photo, all }: Props) {
  const router = useRouter();
  if (router.isFallback) return <div className="p-10">Loading…</div>;
  if (!photo) return <div className="p-10">Photo not found</div>;

  return (
    <>
      <Head>
        <title>{photo.title}</title>
      </Head>

      <main className="p-10 space-y-6 text-white">
        {photo.imageFull && (
          <img
            src={photo.imageFull}
            alt={photo.title}
            className="w-full rounded-md border border-gray-700 object-cover"
          />
        )}

        <h1 className="text-3xl font-semibold">{photo.title}</h1>
        {photo.subtitle && (
          <p className="italic text-gray-400">{photo.subtitle}</p>
        )}

        {typeof photo.body === "string"
          ? photo.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)
          : Array.isArray(photo.body)
          ? photo.body.map((b: any, i: number) =>
              b.type === "paragraph" ? (
                <p key={i}>
                  {b.children?.map((c: any, j: number) => (
                    <span key={j}>{c.text}</span>
                  ))}
                </p>
              ) : null
            )
          : null}

        {/* Ejemplo de listado sencillo con las demás fotos (opcional) */}
        {all.length > 1 && (
          <>
            <hr className="border-gray-600 my-8" />
            <h3 className="text-xl mb-2">More photos</h3>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {all
                .filter((p) => p.slug !== photo.slug)
                .map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/photography/${p.category}/${p.slug}`}
                      className="hover:text-amber-400"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
}

/* ------------- getStaticPaths ------------- */
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${API}/api/photographies?populate=Category`);
  const json = await res.json();

  const paths =
    json?.data?.map((it: any) => {
      const at = it.attributes ?? it;
      const cat =
        at.Category?.data?.attributes?.slug ??
        at.Category?.slug ??
        "uncategorised";
      const [category, slug] = at.slug?.includes("/")
        ? at.slug.split("/")
        : [cat, at.slug];
      return { params: { category, slug } };
    }) ?? [];

  return { paths, fallback: true };
};

/* ------------- getStaticProps ------------- */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(
    `${API}/api/photographies?populate=Category,imageThumb,imageFull&pagination[pageSize]=100`
  );
  const json = await res.json();

  const all: PhotographyBlock[] = (json?.data ?? []).map(mapItem);

  const targetSlug = `${params?.category}/${params?.slug}`;
  const photo = all.find((p) => p.slug === targetSlug) || null;

  return {
    props: { photo, all },
    revalidate: 300, // 5 min
  };
};
