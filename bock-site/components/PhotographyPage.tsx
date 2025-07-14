/* components/PhotographyPage.tsx */
import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PhotoItem } from "@/types/photography";

interface Props {
  intro: PhotoItem;
  photos: PhotoItem[];
  categories: string[];
}

const theme = {
  background: "#A7A9AC",
  accent: "#CDE59C",
  menuText: "#000000",
  menuHover: "#CDE59C",
  logoText: "#000000",
  sectionColor: "#cccccc",
};

export default function PhotographyPage({ intro, photos, categories }: Props) {
  const { query, replace } = useRouter();
  const { category, slug } = query as { category?: string; slug?: string };

  // Redirección al primer slug si falta
  useEffect(() => {
    if (!photos.length || !category) return;

    const firstInCat = photos.find((p) => p.category === category);
    if (!firstInCat) return;

    const slugBelongs =
      slug && photos.some((p) => p.slug === slug && p.category === category);

    if (!slugBelongs) {
      replace(`/photography/${category}/${firstInCat.slug}`, undefined, {
        shallow: true,
      });
    }
  }, [photos, category, slug, replace]);

  // activo: slug válido > intro global
  const active =
    slug && photos.find((p) => p.slug === slug)
      ? (photos.find((p) => p.slug === slug) as PhotoItem)
      : intro;

  // thumbs filtrados
  const thumbs = category
    ? photos.filter((p) => p.category === category)
    : photos;

  return (
    <>
      <Head>
        <title>{active.title}</title>
      </Head>

      <MainLayout
        section="photography"
        subMenuItems={categories.map((c) => c[0].toUpperCase() + c.slice(1))}
        theme={theme}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slug ?? active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
          >
            {/* Foto grande */}
            <article className="col-start-1 col-span-8 md:col-start-1 md:col-span-8 lg:col-start-3 lg:col-span-7 space-y-6 text-black pt-4 md:pt-10">
              {active.imageFull && (
                <img
                  src={active.imageFull}
                  alt={active.title}
                  className="w-full max-h-[80vh] object-contain border border-gray-300 rounded-md"
                />
              )}
              <p className="italic text-gray-500">{active.title}</p>
            </article>

            {/* Tira de thumbs */}
            <div className="col-span-8 lg:col-start-3 lg:col-span-7 pt-6">
              <ul className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
                {thumbs.map((t) => (
                  <li key={t.id} className="shrink-0 w-40">
                    <Link
                      href={`/photography/${t.category}/${t.slug}`}
                      scroll={false}
                      className="block"
                    >
                      <img
                        src={t.imageThumb}
                        alt={t.title}
                        className="w-full aspect-video object-cover rounded-md border border-gray-300 hover:border-[var(--accent)] transition"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Footer />
          </motion.div>
        </AnimatePresence>
      </MainLayout>
    </>
  );
}
