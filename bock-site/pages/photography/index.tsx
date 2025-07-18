// pages/photography/index.tsx
import { GetStaticProps } from "next";
import PhotographyPage from "@/components/PhotographyPage";
import { getPhotographyPhotos, PhotoItem } from "@/lib/photography";

type PageProps = {
  initialData: {
    photos: PhotoItem[];
    intro: PhotoItem;
  };
};

export default function PhotographyHome({ initialData }: PageProps) {
  return <PhotographyPage initialData={initialData} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const photos = await getPhotographyPhotos();
  const intro = photos[0] ?? null;

  if (!intro) {
    return { notFound: true };
  }

  return {
    props: {
      initialData: { photos, intro },
    },
    revalidate: 60,
  };
};
