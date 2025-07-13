/* pages/photography/index.tsx
   – Página raíz de la galería de fotos
   – Pre-renderizada con getStaticProps y re-valida cada 300 s            */

import PhotographyPage from "@/components/PhotographyPage";
import type { PhotographyBlock } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/* -------- types de props -------- */
interface Props {
  blocks: PhotographyBlock[];
}

/* ------------------------------------------------------------------ */
/*  🚀  Static Generation                                              */
/* ------------------------------------------------------------------ */
export async function getStaticProps() {
  /* ⚠️  Ajusta el UID si tu collection-type NO se llama “photographies” */
  const res = await fetch(
    `${API}/api/photographies?populate=Category,imageThumb,imageFull&pagination[pageSize]=100`
  );
  const raw = await res.json();

  /* ––– defensivo: Strapi a veces devuelve null en vez de [] ––– */
  if (!Array.isArray(raw.data)) {
    return { props: { blocks: [] as PhotographyBlock[] }, revalidate: 300 };
  }

  /* ––– mapeo al tipo fuerte ––– */
  const blocks: PhotographyBlock[] = raw.data
    /* descarta entradas sin datos esenciales */
    .filter((it: any) => it?.attributes?.slug && it?.attributes?.title)
    .map((it: any): PhotographyBlock => {
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
    });

  return {
    props: { blocks },
    /* ISR → vuelve a generar si alguien visita después de 5 min */
    revalidate: 300,
  };
}

/* ------------------------------------------------------------------ */
/*  🖼️  Render                                                         */
/* ------------------------------------------------------------------ */
export default function PhotographyIndex({ blocks }: Props) {
  /* Si algo falló en build o aún no hay fotos visibles */
  if (!blocks.length) {
    return (
      <div className="p-10 text-center">
        <p>No photos found or failed to load data.</p>
      </div>
    );
  }

  /* Usa el primer bloque como activo por defecto */
  return <PhotographyPage blocks={blocks} active={blocks[0]} />;
}
