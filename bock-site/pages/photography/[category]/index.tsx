import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PhotoItem } from "@/types/photography";
import { ParsedUrlQuery } from "querystring";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Definir la interfaz para los parámetros de ruta
interface PathParams extends ParsedUrlQuery {
  category: string;
}

interface Props {
  category: string;
  photos: PhotoItem[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${API}/api/photographies?populate=Category`);
    const data = await res.json();

    // Asegurar que categories sea un array de strings
    const categories: string[] = Array.from(
      new Set(
        data.data.map((a: any) => {
          const categoryData = a.attributes?.Category?.data;
          return categoryData ? categoryData.attributes.slug : "uncategorised";
        })
      )
    );

    // Crear paths con tipo explícito
    const paths = categories.map((cat) => ({
      params: { category: cat },
    }));

    return {
      paths,
      fallback: "blocking", // Cambiado a blocking para mejor manejo
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

export const getStaticProps: GetStaticProps<Props, PathParams> = async ({
  params,
}) => {
  try {
    // Obtener todas las fotos
    const photosRes = await fetch(
      `${API}/api/photographies?populate=*&pagination[pageSize]=100`
    );
    const photosData = await photosRes.json();

    // Procesar datos
    const photos: PhotoItem[] = photosData.data.map((p: any) => {
      const attributes = p.attributes || {};
      const categoryData = attributes.Category?.data;
      return {
        id: p.id,
        title: attributes.title || "",
        category: categoryData ? categoryData.attributes.slug : "uncategorised",
        slug: attributes.slug || "",
        imageThumb: attributes.imageThumb?.data?.attributes?.url
          ? `${API}${attributes.imageThumb.data.attributes.url}`
          : "",
        imageFull: attributes.imageFull?.data?.attributes?.url
          ? `${API}${attributes.imageFull.data.attributes.url}`
          : "",
      };
    });

    return {
      props: {
        category: params?.category || "",
        photos,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        category: params?.category || "",
        photos: [],
      },
    };
  }
};

export default function PhotographyCategoryRedirect({
  category,
  photos,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!category || !photos || photos.length === 0) {
      router.replace("/photography");
      return;
    }

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
