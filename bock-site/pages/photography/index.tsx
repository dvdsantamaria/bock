/* pages/photography/index.tsx */
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
    const photos = await getPhotographyPhotos(); // pedido a Strapi
    const intro = photos?.[0] ?? null; // primer foto o null

    return {
      props: {
        initialData: {
          photos: photos ?? [],
          intro,
        },
      },
      revalidate: 60, // reintenta cada 60 s
    };
  } catch (err) {
    console.error("Photography getStaticProps", err);
    return {
      props: {
        initialData: {
          photos: [],
          intro: null,
        },
      },
      revalidate: 60, // intenta de nuevo al minuto
    };
  }
};
