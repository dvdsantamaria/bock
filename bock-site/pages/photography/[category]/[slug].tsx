import { GetStaticPaths, GetStaticProps } from "next";
import PhotographyPage from "@/components/PhotographyPage";
import { PhotoItem } from "@/types/photography";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const url = (p?: string) => (p && p.startsWith("/") ? `${API}${p}` : p ?? "");

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${API}/api/photographies?populate=Category`);
  const data = await res.json();

  const paths = data.data.map((item: any) => ({
    params: {
      category: item.Category?.slug || "uncategorised",
      slug: item.slug,
    },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { category, slug } = params as { category: string; slug: string };

  // Fetch intro
  const introRes = await fetch(`${API}/api/photography-intro`);
  const introData = await introRes.json();

  // Fetch all photos
  const photosRes = await fetch(
    `${API}/api/photographies?populate=*&pagination[pageSize]=100`
  );
  const photosData = await photosRes.json();

  // Process data
  const photos: PhotoItem[] = photosData.data.map((p: any) => ({
    id: p.id,
    title: p.title,
    category: p.Category?.slug || "uncategorised",
    slug: p.slug,
    imageThumb: url(p.imageThumb?.url),
    imageFull: url(p.imageFull?.url),
  }));

  const intro: PhotoItem = {
    id: "intro",
    title: introData.name || introData.title,
    subtitle: photos[0]?.category || "",
    category: photos[0]?.category || "intro",
    slug: photos[0]?.slug || "intro",
    imageThumb: photos[0]?.imageThumb,
    imageFull: photos[0]?.imageFull,
  };

  const categories = Array.from(new Set(photos.map((p) => p.category)));

  return {
    props: { intro, photos, categories },
    revalidate: 60,
  };
};

export default PhotographyPage;
