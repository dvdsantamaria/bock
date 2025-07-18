/* pages/photography/[category]/[slug].tsx */
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import {
  getPhotographyPhotos,
  getPhotographyIntro,
  PhotoItem,
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
  const photos = await getPhotographyPhotos();

  const paths = photos.map((photo: PhotoItem) => ({
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

  const photos = await getPhotographyPhotos();
  const intro = await getPhotographyIntro();

  const photoExists = photos.some(
    (p: PhotoItem) => p.slug === slug && p.category === category
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
    revalidate: 60,
  };
};
