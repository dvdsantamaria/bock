/* components/PhotographyPage.tsx
   ▸ Soporta datos generados por SSG/ISR (props.blocks)
   ▸ Si no vienen, los descarga en CSR (hidratación)
   ▸ Mantiene la navegación y animaciones originales            */

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
  /**  ↳ de getStaticProps / SSG  */
  blocks?: PhotographyBlock[];
  /**  ↳ foto inicial (opcional)  */
  active?: PhotographyBlock;
}

export default function PhotographyPage({ blocks, active }: Props) {
  const { category, slug } = useRouter().query as {
    category?: string;
    slug?: string;
  };

  /* —— estado interno (CSR) —— */
  const [items, setItems] = useState<PhotographyBlock[]>(blocks ?? []);
  const [loading, setLoading] = useState(!blocks);

  /* ---------- CSR fetch (solo si SSG vino vacío) ---------- */
  useEffect(() => {
    if (blocks?.length) return; // ya tenemos data

    (async () => {
      try {
        const res = await fetch(
          `${API}/api/photographies?pagination[pageSize]=100&populate[Category][fields][0]=slug&populate[imageThumb][fields][0]=url&populate[imageFull][fields][0]=url`
        ).then((r) => r.json());

        const fetched: PhotographyBlock[] = Array.isArray(res.data)
          ? res.data
              .filter((it: any) => it.attributes?.Category?.data) // ← ⚠️ FILTRO CRUCIAL
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

  /* ---------- aplicar tema (CSS custom properties) ---------- */
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

  /* ---------- UI ---------- */
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
            {/* ───── desplegable móvil ───── */}
            {related.length > 0 && (
              <div className="col-span-8 md:hidden px-4 pt-4">
                <details className="border border-gray-700 rounded-md bg-black">
                  <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-[var(--menuText)] hover:text-[var(--accent)]">
                    Gallery
                  </summary>
                  <ul className="px-4 py-2 space-y-1">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/photography/${r.category}/${r.slug}`}
                          className="block text-sm hover:text-[var(--accent)]"
                        >
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            )}

            {/* ───── foto principal ───── */}
            <article
              className="
                      col-start-1 col-span-8
                      md:col-start-1 md:col-span-8 md:py-10
                      lg:col-start-2 lg:col-span-8
                      text-white space-y-6
                    "
            >
              {current.imageFull && (
                <img
                  src={current.imageFull}
                  alt={current.title}
                  className="w-full rounded-md border border-gray-700 object-cover"
                />
              )}

              <h1 className="text-3xl font-semibold">{current.title}</h1>
              {current.subtitle && (
                <p className="italic text-gray-400">{current.subtitle}</p>
              )}

              {Array.isArray(current.body)
                ? current.body.map((block: any, i: number) =>
                    block.type === "paragraph" ? (
                      <p key={i}>
                        {block.children?.map((c: any, j: number) => (
                          <span key={j}>{c.text}</span>
                        ))}
                      </p>
                    ) : null
                  )
                : typeof current.body === "string"
                ? current.body
                    .split("\n\n")
                    .map((p: string, i: number) => <p key={i}>{p}</p>)
                : null}
            </article>

            {/* ───── sidebar desktop ───── */}
            {related.length > 0 && (
              <aside className="hidden md:block col-start-10 col-span-2 pt-[42px]">
                <h3 className="uppercase tracking-wider text-sm mb-4">
                  Gallery
                </h3>
                <ul className="space-y-4">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/photography/${r.category}/${r.slug}`}
                        className="group block"
                      >
                        {r.imageThumb && (
                          <img
                            src={r.imageThumb}
                            alt={r.title}
                            className="w-full aspect-video object-cover rounded-md border border-gray-700 group-hover:border-[var(--accent)] transition"
                          />
                        )}
                        <span className="mt-1 block text-xs leading-snug group-hover:text-[var(--accent)]">
                          {r.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <Footer />
          </motion.div>
        </AnimatePresence>
      </MainLayout>
    </>
  );
}
