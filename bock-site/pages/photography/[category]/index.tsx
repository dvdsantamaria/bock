import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getCategories, getRandomPhotoForCategory } from "@/lib/photography";

interface Props {
  redirectSlug: string | null;
}

export default function PhotographyCategoryRedirect({ redirectSlug }: Props) {
  const router = useRouter();
  const category = router.query.category;

  useEffect(() => {
    if (redirectSlug && category) {
      router.replace(`/photography/${category}/${redirectSlug}`);
    }
  }, [redirectSlug, category]);

  return null;
}

/* ---------- paths estáticos para todas las categorías ---------- */
export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategories();
  return {
    paths: categories.map((c) => ({ params: { category: c } })),
    fallback: "blocking",
  };
};

/* ---------- devolvemos el slug para redirigir desde el cliente ---------- */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;

  const randomPhoto = await getRandomPhotoForCategory(category);

  if (!randomPhoto) {
    return { notFound: true };
  }

  return {
    props: {
      redirectSlug: randomPhoto.slug,
    },
    revalidate: 60,
  };
};
