// pages/photography/index.tsx
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { getPhotographyPhotos, PhotoItem } from "@/lib/photography";

const PhotographyPage = dynamic(() => import("@/components/PhotographyPage"), {
  ssr: false,
});

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
