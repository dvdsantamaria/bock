/* components/DesignPage.tsx */
import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BaseItem,
  IntroItem,
  getDesignIntro,
  getDesignArticles,
} from "@/lib/design";

/* ───────── tema ───────── */
const theme = {
  background: "#A7A9AC",
  accent: "#EDBE1C",
  menuText: "#000000",
  menuHover: "#EDBE1C",
  logoText: "#000000",
  sectionColor: "#000000",
};

type DesignPageProps = {
  initialData: {
    intro: IntroItem;
    articles: BaseItem[];
  };
  initialSlug?: string;
};

export default function DesignPage({
  initialData,
  initialSlug,
}: DesignPageProps) {
  const { query } = useRouter();
  const routerSlug = query.slug as string | undefined;

  const slug = initialSlug ?? routerSlug;
  const { intro, articles } = initialData;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);

  const active = slug ? articles.find((a) => a.slug === slug) ?? intro : intro;

  const related =
    "slug" in active
      ? articles.filter((a) => a.slug !== active.slug)
      : articles;

  const image =
    "imageFull" in active
      ? active.imageFull
      : "heroImage" in active
      ? active.heroImage
      : null;

  return (
    <>
      <Head>
        <title>{active.title || "Design"}</title>
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
              {slug && image && (
                <>
                  <img
                    src={image}
                    alt={active.title}
                    className="w-full rounded-md border border-gray-300 object-cover"
                  />
                  <hr className="border-t-4 border-[var(--accent)] my-6 w-1/2" />
                </>
              )}

              <h1 className="text-3xl font-semibold">{active.title}</h1>
              {active.subtitle && (
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
