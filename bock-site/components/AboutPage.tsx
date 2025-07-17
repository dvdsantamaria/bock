// components/AboutPage.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Article, Intro as BaseIntro } from "@/lib/about";

/* ---------- tema local ---------- */
const theme: Record<string, string> = {
  background: "#A7A9AC",
  accent: "#EDBE1C",
  menuText: "#000000",
  menuHover: "#EDBE1C",
  logoText: "#000000",
  sectionColor: "#000000",
};

// Extendemos el tipo Intro para incluir los campos nuevos
interface Intro extends BaseIntro {
  thumbPos?: "top" | "center" | "bottom";
  imageThumbTop?: string | null;
  imageThumbCenter?: string | null;
  imageThumbBottom?: string | null;
}

type AboutSectionProps = {
  initialData: {
    intro: Intro;
    articles: Article[];
  };
  initialSlug?: string;
};

export default function AboutSection({
  initialData,
  initialSlug,
}: AboutSectionProps) {
  const { query } = useRouter();
  const routerSlug = query.slug as string | undefined;

  const slug = initialSlug ?? routerSlug;
  const { intro, articles } = initialData;

  const thumbMap: Record<"top" | "center" | "bottom", string | undefined> = {
    top: intro.imageThumbTop || undefined,
    center: intro.imageThumbCenter || undefined,
    bottom: intro.imageThumbBottom || undefined,
  };

  const thumbUrl = intro.thumbPos ? thumbMap[intro.thumbPos] : undefined;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);

  const active =
    slug && typeof slug === "string"
      ? articles.find((a) => a.slug === slug) ?? intro
      : intro;

  const related =
    active === intro ? articles : articles.filter((a) => a.slug !== slug);

  const image =
    "imageFull" in active
      ? active.imageFull
      : "heroImage" in active
      ? active.heroImage
      : null;

  return (
    <>
      <Head>
        <title>{active.title || "About"}</title>
      </Head>

      <MainLayout section="about" subMenuItems={["", "", ""]} theme={theme}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slug ?? "about-intro"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
          >
            {/* Imagen cuando no hay slug (intro) */}
            {!slug && thumbUrl && (
              <div style={{ marginBottom: "2rem" }}>
                <img
                  src={thumbUrl}
                  alt="Thumbnail"
                  style={{
                    width: "100%",
                    maxWidth: "900px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* Dropdown mobile */}
            {related.length > 0 && (
              <div className="col-span-8 md:hidden px-4 pt-4">
                <details className="border border-gray-300 rounded-md bg-white">
                  <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-[var(--menuText)] hover:text-[var(--accent)]">
                    Explore&nbsp;more
                  </summary>
                  <ul className="px-4 py-2 space-y-1">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <a
                          href={`/about/${r.slug}`}
                          className="block text-sm hover:text-[var(--accent)]"
                        >
                          {r.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            )}

            {/* Contenido principal */}
            <article className="col-start-1 md:col-start-3 col-span-8 md:col-span-7 text-black p-6 md:p-10 space-y-6">
              {slug && image && (
                <img
                  src={image}
                  alt={active.title}
                  className="w-full rounded-md border border-gray-300 object-cover"
                />
              )}

              {slug && (
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
                        {block.children?.map((child: any, j: number) => (
                          <span key={j}>{child.text}</span>
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

            {/* Aside desktop */}
            {related.length > 0 && (
              <aside className="hidden md:block col-start-10 col-span-2 md:pt-[42px]">
                <h3
                  className="uppercase tracking-wider text-sm mb-4"
                  style={{ color: "var(--sectionColor)" }}
                >
                  Explore&nbsp;more
                </h3>
                <ul className="space-y-4">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/about/${r.slug}`} className="group block">
                        {"imageThumb" in r && r.imageThumb && (
                          <img
                            src={r.imageThumb}
                            alt={r.title}
                            className="w-full aspect-video object-cover rounded-md border border-gray-300 group-hover:border-[var(--accent)] transition"
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
