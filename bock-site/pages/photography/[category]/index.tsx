import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PhotoItem } from "@/types/photography";
import { ParsedUrlQuery } from "querystring";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Extender ParsedUrlQuery para satisfacer la restricción
interface PathParams extends ParsedUrlQuery {
  category: string;
}

interface Props {
  category: string;
  photos: PhotoItem[];
}

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const res = await fetch(`${API}/api/photographies?populate=Category`);
  const data = await res.json();

  // Asegurar que categories sea un array de strings
  const categories: string[] = Array.from(
    new Set(data.data.map((a: any) => a.Category?.slug || "uncategorised"))
  );

  return {
    paths: categories.map((cat) => ({ params: { category: cat } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, PathParams> = async ({
  params,
}) => {
  // Obtener todas las fotos
  const photosRes = await fetch(
    `${API}/api/photographies?populate=*&pagination[pageSize]=100`
  );
  const photosData = await photosRes.json();

  // Procesar datos
  const photos: PhotoItem[] = photosData.data.map((p: any) => ({
    id: p.id,
    title: p.title,
    category: p.Category?.slug || "uncategorised",
    slug: p.slug,
    imageThumb: p.imageThumb?.url ? `${API}${p.imageThumb.url}` : "",
    imageFull: p.imageFull?.url ? `${API}${p.imageFull.url}` : "",
  }));

  return {
    props: {
      category: params?.category || "",
      photos,
    },
    revalidate: 60,
  };
};

export default function PhotographyCategoryRedirect({
  category,
  photos,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!category || !photos) return;

    // Filtrar fotos por categoría
    const categoryPhotos = photos.filter((p) => p.category === category);

    if (categoryPhotos.length > 0) {
      // Seleccionar una foto aleatoria
      const randomPhoto =
        categoryPhotos[Math.floor(Math.random() * categoryPhotos.length)];
      router.replace(
        `/photography/${randomPhoto.category}/${randomPhoto.slug}`
      );
    } else {
      // Redirigir a la página principal si no hay fotos
      router.replace("/photography");
    }
  }, [category, photos, router]);

  return <div className="p-10">Loading...</div>;
}
