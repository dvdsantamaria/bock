/* components/WritingPage.tsx */
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ---------- tipos ---------- */
interface Article {
  id: number;
  title: string;
  subtitle?: string;
  body: any; // string o array Slate
  slug: string;
  category: string;
}

interface Intro {
  title: string;
  subtitle?: string;
  body: any;
  slug: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/* ---------- tema ---------- */
const theme = {
  background: "#ffffff",
  accent: "#9FD5B9",
  menuText: "#000000",
  menuHover: "#9FD5B9",
  logoText: "#000000",
  sectionColor: "#808080",
};

/* ---------- helpers ---------- */
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function WritingPage() {
  const { query } = useRouter();
  const { category, slug } = query as { category?: string; slug?: string };

  const [intro, setIntro] = useState<Intro | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  /* ----- fetch Strapi ----- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* intro (single-type) */
        const introRes = await fetch(`${API}/api/writing-intro`);
        const introRaw = (await introRes.json()).data;
        setIntro({
          id: "intro",
          title: introRaw.name || introRaw.title, // ← aquí
          subtitle: introRaw.subtitle,
          body: introRaw.content || introRaw.body,
          category: "intro",
          slug: introRaw.slug,
        });

        /* artículos (collection) */
        const artRes = await fetch(
          `${API}/api/writings?populate=*&pagination[pageSize]=100`
        );
        const artData = (await artRes.json()).data as any[];

        setArticles(
          artData.map((it) => ({
            id: it.id,
            title: it.title,
            subtitle: it.subtitle,
            body: it.body || it.content,
            slug: it.slug,
            category: it.Category?.slug || "uncategorised",
          }))
        );
      } catch (err) {
        console.error("Error fetching writings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ----- custom props (tema) ----- */
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);

  if (loading || !intro) return <div className="p-10">Loading…</div>;

  /* ----- cuál es el activo según ruta ----- */
  const byCategory = (cat: string) =>
    articles.filter((a) => a.category === cat);

  let active: Intro | Article;

  if (slug && category) {
    active =
      byCategory(category).find((a) => a.slug === slug) ??
      byCategory(category)[0] ??
      intro;
  } else if (category) {
    active = byCategory(category)[0] ?? intro;
  } else {
    active = intro;
  }

  /* ----- related (misma categoría) ----- */
  const related =
    active === intro
      ? articles
      : byCategory((active as Article).category).filter(
          (a) => a.slug !== (active as Article).slug
        );

  const categories = Array.from(
    new Set(articles.map((a) => a.category))
  ).sort();

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
            key={(active as any).slug ?? "intro"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
            style={{
              ["--menu-text" as any]: theme.menuText,
              ["--accent" as any]: theme.accent,
              ["--section-color" as any]: theme.sectionColor,
            }}
          >
            {/* ─ mobile dropdown ─ */}
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

            {/* ─ artículo principal ─ */}
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

            {/* ─ aside desktop ─ */}
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
