import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { getPhotographyPhotos, PhotoItem } from "@/lib/photography";

const PhotographyPage = dynamic(() => import("@/components/PhotographyPage"), {
  ssr: false,
});

interface PageProps {
  initialData: {
    photos: PhotoItem[];
    intro: PhotoItem | null;
  };
}

export default function PhotographyHome({ initialData }: PageProps) {
  return <PhotographyPage initialData={initialData} />;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const photos = await getPhotographyPhotos();
    const intro = photos?.[0] ?? null;

    return {
      props: { initialData: { photos: photos ?? [], intro } },
      revalidate: 60,
    };
  } catch (err) {
    console.error("Photography getStaticProps", err);
    return {
      props: { initialData: { photos: [], intro: null } },
      revalidate: 60,
    };
  }
};
