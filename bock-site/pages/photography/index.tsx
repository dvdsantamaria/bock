// pages/photography/index.tsx
import { GetStaticProps } from "next";
import PhotographyPage from "@/components/PhotographyPage";
import { PhotoItem } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const url = (p?: string) => (p && p.startsWith("/") ? `${API}${p}` : p ?? "");

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Fetch intro - Strapi v4 structure
    const introRes = await fetch(`${API}/api/photography-intro?populate=*`);
    const introJson = await introRes.json();
    const introData = introJson.data?.attributes || {};

    // Fetch all photos - Strapi v4 structure
    const photosRes = await fetch(
      `${API}/api/photographies?populate=*&pagination[pageSize]=100`
    );
    const photosJson = await photosRes.json();

    // Process photos data
    const photos: PhotoItem[] = photosJson.data.map((p: any) => {
      const attributes = p.attributes || {};
      return {
        id: p.id,
        title: attributes.title || "",
        category:
          attributes.category?.data?.attributes?.slug || "uncategorised",
        slug: attributes.slug || "",
        imageThumb: attributes.imageThumb?.data?.attributes?.url
          ? url(attributes.imageThumb.data.attributes.url)
          : "",
        imageFull: attributes.imageFull?.data?.attributes?.url
          ? url(attributes.imageFull.data.attributes.url)
          : "",
      };
    });

    // Create intro item
    const intro: PhotoItem = {
      id: "intro",
      title: introData.name || introData.title || "Photography",
      subtitle: photos[0]?.category || "",
      body: "",
      category: photos[0]?.category || "intro",
      slug: photos[0]?.slug || "intro",
      imageThumb: photos[0]?.imageThumb || "",
      imageFull: photos[0]?.imageFull || "",
    };

    const categories = Array.from(new Set(photos.map((p) => p.category)));

    return {
      props: {
        intro,
        photos,
        categories,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        intro: {
          id: "intro",
          title: "Photography",
          subtitle: "",
          body: "",
          category: "intro",
          slug: "intro",
          imageThumb: "",
          imageFull: "",
        },
        photos: [],
        categories: [],
      },
    };
  }
};

export default PhotographyPage;
