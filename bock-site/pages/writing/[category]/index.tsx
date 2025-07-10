import { useRouter } from "next/router";
import writingJson from "@/data/writing.json";
import dynamic from "next/dynamic";

/* carga diferida del componente */
const WritingPage = dynamic(() => import("@/components/WritingPage"), {
  ssr: false,
}) as any; //  ←  ⬅️ cast a any para aceptar props

export default function WritingCategoryIndex() {
  const router = useRouter();
  const { category } = router.query as { category?: string };

  if (!category) return null; // aún sin SSR de esta ruta

  const { intro, articles } = writingJson as any;

  const firstInCat =
    articles.find((a: any) => a.category === category) ?? intro;

  const related = articles
    .filter((a: any) => a.category === category && a.slug !== firstInCat.slug)
    .map((a: any) => ({
      label: a.title,
      href: `/writing/${a.category}/${a.slug}`,
    }));

  const categories = Array.from(new Set(articles.map((a: any) => a.category)));

  return (
    <WritingPage
      active={firstInCat}
      related={related}
      categories={categories}
    />
  );
}
