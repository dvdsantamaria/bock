import { useRouter } from "next/router";
import writingJson from "@/data/writing.json";
import WritingPage, { WritingJson, Writing } from "@/components/WritingPage";

export default function WritingCategoryIndex() {
  const router = useRouter();
  const { category } = router.query as { category?: string };

  const { intro, articles } = writingJson as unknown as WritingJson;

  if (!category) return null; // loading SSR

  /* cover dinámico por categoría */
  const cover: Writing = {
    id: `cover-${category}`,
    title: category[0].toUpperCase() + category.slice(1),
    subtitle: `All articles tagged “${category}”`,
    body: "Seleccione un artículo de la lista de la derecha o del desplegable móvil.",
    category,
    slug: "cover",
  };

  const related = articles
    .filter((a) => a.category === category)
    .map((a) => ({ label: a.title, href: `/writing/${a.category}/${a.slug}` }));

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <WritingPage
      json={writingJson as any}
      active={cover}
      related={related}
      categories={categories}
    />
  );
}
