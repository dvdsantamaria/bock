import PhotographyPage from "@/components/PhotographyPage";
import { GetStaticProps } from "next";
import { PhotoItem } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await fetch(`${API}/photographies`);
    const photos: PhotoItem[] = await res.json();

    let intro: PhotoItem | null = null;
    if (photos.length > 0) {
      const first = photos[0];
      intro = {
        id: 0,
        title: first.title,
        category: first.category,
        slug: first.slug,
        imageThumb: first.imageThumb,
        imageFull: first.imageFull,
      };
    }

    return {
      props: {
        initialPhotos: photos,
        initialIntro: intro,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        initialPhotos: [],
        initialIntro: null,
      },
    };
  }
};

export default function PhotographyHome({ initialPhotos, initialIntro }: any) {
  return (
    <PhotographyPage
      initialPhotos={initialPhotos}
      initialIntro={initialIntro}
    />
  );
}
