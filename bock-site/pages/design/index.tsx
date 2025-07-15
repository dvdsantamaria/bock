/* pages/design/index.tsx */
import dynamic from "next/dynamic";
import { getDesignIntro, getDesignArticles } from "@/lib/design";

export async function getStaticProps() {
  try {
    const intro = await getDesignIntro();
    const articles = await getDesignArticles();

    return {
      props: {
        initialData: { intro, articles },
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        initialData: {
          intro: {
            title: "Design",
            subtitle: null,
            body: null,
            heroImage: null,
          },
          articles: [],
        },
      },
      revalidate: 10,
    };
  }
}

const DesignPage = dynamic(() => import("@/components/DesignPage"), {
  ssr: false,
});

export default function DesignIndex({ initialData }: any) {
  return <DesignPage initialData={initialData} />;
}
