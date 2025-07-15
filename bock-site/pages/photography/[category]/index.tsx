/* pages/photography/[category]/index.tsx */
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { getRandomPhotoForCategory, PhotoItem } from "@/lib/photography";

export default function PhotographyCategoryRedirect() {
  const router = useRouter();
  // La redirección real se maneja en el componente PhotographyPage
  return null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Pre-generamos paths para todas las categorías
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;

  // Redirigimos directamente a una foto aleatoria
  const randomPhoto = await getRandomPhotoForCategory(category);

  if (!randomPhoto) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: `/photography/${category}/${randomPhoto.slug}`,
      permanent: false,
    },
  };
};
