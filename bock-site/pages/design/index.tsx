// pages/design/index.tsx

import dynamic from "next/dynamic";
import { getDesignArticles } from "@/lib/design";

export async function getStaticProps() {
  try {
    const articles = await getDesignArticles();

    return {
      props: {
        initialData: articles,
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        initialData: [],
      },
      revalidate: 10,
    };
  }
}

const DesignSection = dynamic(() => import("@/components/DesignPage"), {
  ssr: false,
});

export default function DesignIndex({ initialData }: any) {
  return <DesignSection initialData={initialData} />;
}
