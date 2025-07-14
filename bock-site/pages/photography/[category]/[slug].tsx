import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const PhotographyPage = dynamic(() => import("@/components/PhotographyPage"), {
  ssr: false,
});

export default function PhotographyDetail() {
  const { query } = useRouter();
  const { category, slug } = query as { category?: string; slug?: string };

  // Evita que Next trate de renderizar en SSR sin datos.
  if (!category || !slug) return null;

  return <PhotographyPage />;
}
