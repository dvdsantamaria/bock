/* pages/photography/[category]/[slug].tsx */
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import {
  getAllPhotographies,
  PhotoItem,
  getPhotoBySlug,
} from "@/lib/photography";

const PhotographyPage = dynamic(() => import("@/components/PhotographyPage"), {
  ssr: false,
});

interface PageProps {
  initialData: {
    photos: PhotoItem[];
    intro: PhotoItem;
  };
}

export default function PhotographyDetail({ initialData }: PageProps) {
  return <PhotographyPage initialData={initialData} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const photos = await getAllPhotographies();

  const paths = photos.map((photo) => ({
    params: {
      category: photo.category,
      slug: photo.slug,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;
  const slug = params?.slug as string;

  const photos = await getAllPhotographies();
  const intro = photos.length > 0 ? photos[0] : null;

  // Verificar que la foto existe
  const photoExists = photos.some(
    (p) => p.slug === slug && p.category === category
  );

  if (!photoExists || !intro) {
    return { notFound: true };
  }

  return {
    props: {
      initialData: {
        photos,
        intro,
      },
    },
    revalidate: 60, // ISR cada 60 segundos
  };
};
