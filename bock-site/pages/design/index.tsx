/* pages/design/index.tsx */
import dynamic from "next/dynamic";
import type { Intro, Design } from "@/lib/design";
import { getDesignIntro, getDesignArticles } from "@/lib/design";

export async function getStaticProps() {
  try {
    const intro: Intro = await getDesignIntro();
    const articles: Design[] = await getDesignArticles();

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

export default function DesignIndex({
  initialData,
}: {
  initialData: { intro: Intro; articles: Design[] };
}) {
  return <DesignPage initialData={initialData} />;
}
