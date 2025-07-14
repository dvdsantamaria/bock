import { GetStaticPaths, GetStaticProps } from "next";
import PhotographyPage from "@/components/PhotographyPage";
import { PhotoItem } from "@/types/photography";
import { ParsedUrlQuery } from "querystring";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Definir la interfaz para los parámetros de ruta
interface PathParams extends ParsedUrlQuery {
  category: string;
  slug: string;
}

// Función para construir URL completa
const url = (p?: string) => (p && p.startsWith("/") ? `${API}${p}` : p ?? "");

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${API}/api/photographies?populate=Category`);
    const data = await res.json();

    const paths = data.data.map((item: any) => {
      const attributes = item.attributes || {};
      const categoryData = attributes.Category?.data;
      return {
        params: {
          category: categoryData
            ? categoryData.attributes.slug
            : "uncategorised",
          slug: attributes.slug || "",
        },
      };
    });

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const { category, slug } = params as PathParams;

  try {
    // Fetch intro
    const introRes = await fetch(`${API}/api/photography-intro?populate=*`);
    const introJson = await introRes.json();
    const introData = introJson.data?.attributes || {};

    // Fetch all photos
    const photosRes = await fetch(
      `${API}/api/photographies?populate=*&pagination[pageSize]=100`
    );
    const photosJson = await photosRes.json();

    // Process photos data
    const photos: PhotoItem[] = photosJson.data.map((p: any) => {
      const attributes = p.attributes || {};
      const categoryData = attributes.Category?.data;
      return {
        id: p.id,
        title: attributes.title || "",
        category: categoryData ? categoryData.attributes.slug : "uncategorised",
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
      subtitle: "",
      body: "",
      category: "intro",
      slug: "intro",
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
    console.error("Error in getStaticProps for [slug]:", error);
    return {
      notFound: true,
    };
  }
};

export default PhotographyPage;
