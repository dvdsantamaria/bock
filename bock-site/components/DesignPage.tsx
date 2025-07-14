/* components/DesignPage.tsx */
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ───────── tipos ───────── */
interface BaseItem {
  id: number;
  title: string;
  subtitle?: string;
  body: any;
  slug: string;
  imageThumb?: string;
  imageFull?: string;
}

interface IntroItem {
  title: string;
  subtitle?: string;
  body: any;
  heroImage?: string;
}

/* ───────── tema ───────── */
const theme = {
  background: "#A7A9AC",
  accent: "#EDBE1C",
  menuText: "#000000",
  menuHover: "#EDBE1C",
  logoText: "#000000",
  sectionColor: "#000000",
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function DesignPage() {
  const { slug } = useRouter().query as { slug?: string };

  const [intro, setIntro] = useState<IntroItem | null>(null);
  const [articles, setArticles] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── fetch Strapi ── */
  useEffect(() => {
    (async () => {
      try {
        /* intro (single type) */
        const introRaw = (
          await (await fetch(`${API}/api/design-intro?populate=*`)).json()
        ).data;
        setIntro({
          title: introRaw.title,
          subtitle: introRaw.subtitle,
          body: introRaw.content || introRaw.body,
          heroImage: introRaw.imageFull?.url
            ? `${API}${introRaw.imageFull.url}`
            : undefined,
        });

        /* colección */
        const artRaw = (
          await (
            await fetch(
              `${API}/api/designs?populate=*&pagination[pageSize]=100`
            )
          ).json()
        ).data;
        setArticles(
          artRaw.map((i: any) => ({
            id: i.id,
            title: i.title,
            subtitle: i.subtitle,
            body: i.body || i.content,
            slug: i.slug,
            imageThumb: i.imageThumb?.url
              ? `${API}${i.imageThumb.url}`
              : undefined,
            imageFull: i.imageFull?.url
              ? `${API}${i.imageFull.url}`
              : undefined,
          }))
        );
      } catch (err) {
        console.error("Error fetching Design data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── custom-props del tema ── */
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);

  if (loading || !intro) return <div className="p-10">Loading…</div>;

  /* activo */
  const active = slug ? articles.find((a) => a.slug === slug) ?? intro : intro;

  /* related */
  const related =
    "slug" in active
      ? articles.filter((a) => a.slug !== active.slug)
      : articles;

  /* ── render ── */
  return (
    <>
      <Head>
        <title>{active.title}</title>
      </Head>

      <MainLayout section="design" subMenuItems={["", "", ""]} theme={theme}>
        <AnimatePresence mode="wait">
          <motion.div
            key={"slug" in active ? active.slug : "design-intro"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
          >
            {/* ─── carrusel móvil ─── */}
            {related.length > 0 && (
              <div className="col-span-8 md:hidden px-4 pt-4">
                <details className="border border-gray-300 rounded-md bg-white">
                  <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-[var(--menuText)] hover:text-[var(--accent)]">
                    Projects
                  </summary>
                  <ul className="px-4 py-2 space-y-1">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/design/${r.slug}`}
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

            {/* ─── artículo principal ─── */}
            <article
              className="
                col-start-1 col-span-9
                md:col-start-1 md:col-span-8 md:py-10 md:pr-10
                lg:col-start-3 lg:col-span-7
                text-black space-y-6
              "
            >
              {("imageFull" in active || "heroImage" in active) &&
                ((active as any).imageFull || (active as any).heroImage) && (
                  <img
                    src={(active as any).imageFull ?? (active as any).heroImage}
                    alt={active.title}
                    className="w-full rounded-md border border-gray-300 object-cover"
                  />
                )}

              {("imageFull" in active || "heroImage" in active) && (
                <hr className="border-t-4 border-[var(--accent)] my-6 w-1/2" />
              )}

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

            {/* ─── aside desktop ─── */}
            {related.length > 0 && (
              <aside className="hidden md:block col-start-10 col-span-2 pt-[42px]">
                <h3
                  className="uppercase tracking-wider text-sm mb-4"
                  style={{ color: "var(--sectionColor)" }}
                >
                  Projects
                </h3>
                <ul className="space-y-4">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/design/${r.slug}`} className="group block">
                        {r.imageThumb && (
                          <img
                            src={r.imageThumb}
                            alt={r.title}
                            className="w-full aspect-video object-cover rounded-md border border-gray-300 group-hover:border-[var(--accent)] transition"
                          />
                        )}
                        <span className="mt-1 block text-xs leading-snug text-[var(--menuText)] group-hover:text-[var(--accent)]">
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
