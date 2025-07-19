/* pages/photography/[category]/index.tsx */
import { GetStaticPaths, GetStaticProps } from "next";
import {
  getCategories,
  getRandomPhotoForCategory,
  getPhotographyPhotos,
  PhotoItem,
} from "@/lib/photography";

/* El componente no renderiza nada: la redirección se hace en getStaticProps */
export default function PhotographyCategoryRedirect() {
  return null;
}

/* ---------- paths estáticos para todas las categorías ---------- */
export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategories(); // ["travel", "nature", ...]
  return {
    paths: categories.map((c) => ({ params: { category: c } })),
    fallback: "blocking", // ISR para nuevas categorías
  };
};

/* ---------- redirección al slug dentro de la categoría ---------- */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;

  // 1) Buscamos fotos de esa categoría
  const randomPhoto = await getRandomPhotoForCategory(category);

  // Si no existe la categoría (o no tiene fotos) -> 404
  if (!randomPhoto) {
    return { notFound: true };
  }

  // 2) Redirigimos al slug dentro de la categoría
  return {
    redirect: {
      destination: `/photography/${category}/${randomPhoto.slug}`,
      permanent: false,
    },
  };
};
