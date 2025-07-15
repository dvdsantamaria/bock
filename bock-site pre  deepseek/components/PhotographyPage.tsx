// components/PhotographyPage.tsx

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import type { PhotographyBlock } from "@/types/photography";

/* ---------- tema ---------- */
const theme = {
  background: "#000000",
  accent: "#EDBE1C",
  menuText: "#ffffff",
  menuHover: "#EDBE1C",
  logoText: "#ffffff",
  sectionColor: "#ffffff",
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/* ---------- helpers ---------- */
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

interface Props {
  blocks?: PhotographyBlock[];
  active?: PhotographyBlock;
}

export default function PhotographyPage({ blocks, active }: Props) {
  const { category, slug } = useRouter().query as {
    category?: string;
    slug?: string;
  };

  const [items, setItems] = useState<PhotographyBlock[]>(blocks ?? []);
  const [loading, setLoading] = useState(!blocks);

  useEffect(() => {
    if (blocks?.length) return;

    (async () => {
      try {
        const res = await fetch(
          `${API}/api/photographies` +
            `?pagination[pageSize]=100` +
            `&populate[Category][fields][0]=slug` +
            `&populate[imageThumb][fields][0]=url` +
            `&populate[imageFull][fields][0]=url`
        ).then((r) => r.json());

        const fetched: PhotographyBlock[] = Array.isArray(res.data)
          ? res.data
              .filter((it: any) => it.attributes?.Category?.data)
              .map((it: any) => {
                const a = it.attributes;
                return {
                  id: it.id,
                  title: a.title,
                  subtitle: a.subtitle ?? "",
                  body: a.body ?? a.content ?? "",
                  slug: a.slug,
                  category: a.Category.data.attributes.slug ?? "uncategorised",
                  imageThumb: a.imageThumb?.data?.attributes?.url
                    ? `${API}${a.imageThumb.data.attributes.url}`
                    : undefined,
                  imageFull: a.imageFull?.data?.attributes?.url
                    ? `${API}${a.imageFull.data.attributes.url}`
                    : undefined,
                };
              })
          : [];

        setItems(fetched);
      } catch (err) {
        console.error("Error fetching photographs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [blocks]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v as string)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);

  if (loading) return <div className="p-10">Loading…</div>;
  if (!items.length) return <div className="p-10">No photos found.</div>;

  /* ---------- decidir foto activa ---------- */
  let current: PhotographyBlock = active ?? items[0];
  if (slug && category) {
    current =
      items.find((p) => p.slug === slug && p.category === category) ?? current;
  }

  const related = items.filter((p) => p.slug !== current.slug);
  const categories = Array.from(new Set(items.map((p) => p.category)));

  return (
    <>
      <Head>
        <title>{current.title}</title>
      </Head>

      <MainLayout
        section="photography"
        subMenuItems={categories.map(cap)}
        theme={theme}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
          >
            {/* Foto principal */}
            <article className="col-start-1 col-span-8 lg:col-start-3 lg:col-span-7 space-y-6 text-white pt-4 md:pt-10">
              {current.imageFull && (
                <img
                  src={current.imageFull}
                  alt={current.title}
                  className="w-full max-h-[80vh] object-contain border border-gray-700 rounded-md"
                />
              )}
              <p className="italic text-gray-400">{current.title}</p>
            </article>

            {/* Carrusel horizontal (mismo para mobile y desktop) */}
            {related.length > 0 && (
              <div className="col-span-8 lg:col-start-3 lg:col-span-7 pt-6">
                <ul className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
                  {related.map((r) => (
                    <li key={r.id} className="shrink-0 w-40">
                      <Link
                        href={`/photography/${r.category}/${r.slug}`}
                        scroll={false}
                        className="block"
                      >
                        <img
                          src={r.imageThumb}
                          alt={r.title}
                          className="w-full aspect-video object-cover rounded-md border border-gray-700 hover:border-[var(--accent)] transition"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Footer />
          </motion.div>
        </AnimatePresence>
      </MainLayout>
    </>
  );
}
