import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Intro, Article, LinkItem } from "@/types/writing";

interface Props {
  active: Intro | Article;
  related: LinkItem[];
  categories: string[];
  articles: Article[];
}

const theme = {
  background: "#ffffff",
  accent: "#9FD5B9",
  menuText: "#000000",
  menuHover: "#9FD5B9",
  logoText: "#000000",
  sectionColor: "#808080",
};

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function WritingPage({
  active: initialActive,
  related: initialRelated,
  categories,
  articles,
}: Props) {
  const { category, slug } = useRouter().query as {
    category?: string;
    slug?: string;
  };

  /* ---------- decide activo dinámicamente ---------- */
  const byCategory = (cat: string) =>
    articles.filter((a) => a.category === cat);

  let active: Intro | Article = initialActive;
  if (slug && category) {
    active =
      byCategory(category).find((a) => a.slug === slug) ??
      byCategory(category)[0] ??
      initialActive;
  } else if (category) {
    active = byCategory(category)[0] ?? initialActive;
  }

  const related =
    active === initialActive
      ? initialRelated
      : byCategory((active as Article).category).filter(
          (a) => a.slug !== (active as Article).slug
        );

  /* ---------- tema ---------- */
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);

  /* ---------- render ---------- */
  return (
    <>
      <Head>
        <title>{active.title}</title>
      </Head>

      <MainLayout
        section="writing"
        subMenuItems={categories.map(cap)}
        theme={theme}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={"slug" in active ? active.slug : "intro"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
          >
            {/* dropdown móvil */}
            {related.length > 0 && (
              <div className="col-span-8 md:hidden px-4 pt-4">
                <details className="border border-gray-300 rounded-md bg-white">
                  <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-[var(--menuText)] hover:text-[var(--accent)]">
                    Explore more
                  </summary>
                  <ul className="px-4 py-2 space-y-1">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/writing/${r.category}/${r.slug}`}
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

            {/* artículo */}
            <article
              className="
                col-start-1 col-span-8
                md:col-start-1 md:col-span-8 md:py-10 md:pr-10
                lg:col-start-3 lg:col-span-7
                text-black space-y-6
              "
            >
              <h1 className="text-3xl font-semibold">{active.title}</h1>
              {"subtitle" in active && active.subtitle && (
                <p className="italic text-gray-500">{active.subtitle}</p>
              )}

              {Array.isArray(active.body)
                ? active.body.map((block: any, i: number) =>
                    block.type === "paragraph" ? (
                      <p key={i}>
                        {block.children?.map((c: any, j: number) => (
                          <span key={j}>{c.text}</span>
                        ))}
                      </p>
                    ) : null
                  )
                : typeof active.body === "string"
                ? active.body
                    .split("\n\n")
                    .map((p: string, i: number) => <p key={i}>{p}</p>)
                : null}
            </article>

            {/* aside desktop */}
            {related.length > 0 && (
              <aside className="hidden md:block col-start-10 col-span-2 md:pt-[42px]">
                <h3
                  className="uppercase tracking-wider text-sm mb-4"
                  style={{ color: "var(--sectionColor)" }}
                >
                  Explore more
                </h3>
                <ul className="space-y-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/writing/${r.category}/${r.slug}`}
                        className="block text-sm hover:text-[var(--accent)]"
                      >
                        {r.title}
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
