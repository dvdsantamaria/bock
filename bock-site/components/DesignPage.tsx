// components/DesignPage.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Design as DesignArticle } from "@/lib/design";

/* ---------- tema local ---------- */
const theme: Record<string, string> = {
  background: "#B4B2A6",
  accent: "#EDBE1C",
  menuText: "#000000",
  menuHover: "#EDBE1C",
  logoText: "#000000",
  sectionColor: "#000000",
};

type DesignSectionProps = {
  /** Lista de diseños (artículos) ya normalizados desde lib/design. */
  initialData: DesignArticle[];
  /** Slug inicial opcional cuando se renderiza en páginas estáticas. */
  initialSlug?: string;
};

/** Devuelve el thumb correcto según thumbPos (o fallback a imageThumb legacy). */
const pickThumb = (a: DesignArticle): string | null => {
  const pos = a.thumbPos ?? "center";
  const key = `imageThumb${pos[0].toUpperCase()}${pos.slice(
    1
  )}` as keyof DesignArticle;
  return (a[key] as string | null) ?? a.imageThumb ?? null;
};

export default function DesignSection({
  initialData,
  initialSlug,
}: DesignSectionProps) {
  const { query } = useRouter();
  const slug = (initialSlug ?? query.slug) as string | undefined;

  /* ---------- set CSS vars ---------- */
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);

  /* ---------- activo & relacionados ---------- */
  const data = Array.isArray(initialData) ? initialData : [];
  const active =
    (slug && data.find((a) => a.slug === slug)) ||
    (data.length ? data[0] : null);
  const related = active ? data.filter((a) => a.slug !== active.slug) : data;

  /* ---------- imágenes ---------- */
  const hero =
    (active?.imageWatermarked ?? null) ||
    (active?.imageFull ?? null) ||
    (active ? pickThumb(active) : null);

  const thumb = active ? pickThumb(active) : null; // usado solo en portada sin slug si querés

  /* ---------- submenú ---------- */
  const subMenuItems = data.map((d) => d.title);

  return (
    <>
      <Head>
        <title>{active?.title || "Design"}</title>
      </Head>

      <MainLayout section="about" subMenuItems={["", "", ""]} theme={theme}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slug ?? "design-intro"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
          >
            {/* ► Thumb / encabezado si no hay slug */}
            {!slug && active && thumb && (
              <div className="col-span-8 mb-8">
                <img
                  src={thumb}
                  alt={active.title}
                  className="w-full max-w-[900px] object-cover rounded-md border border-gray-300"
                  loading="lazy"
                />
              </div>
            )}

            {/* ► menú desplegable mobile */}
            {related.length > 0 && (
              <div className="col-span-8 md:hidden px-4 pt-4">
                <details className="border border-gray-300 rounded-md bg-white">
                  <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-[var(--menuText)] hover:text-[var(--accent)]">
                    Explore&nbsp;more
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

            {/* ► main article */}
            <article className="col-start-1 md:col-start-3 col-span-8 md:col-span-7 text-black p-6 md:p-10 space-y-6">
              {slug && active && hero && (
                <img
                  src={hero}
                  alt={active.title}
                  className="w-full rounded-md border border-gray-300 object-cover"
                />
              )}

              {slug && (
                <hr className="border-t-4 border-[var(--accent)] my-6 w-1/2" />
              )}

              {active && (
                <>
                  <h1 className="text-3xl font-semibold">{active.title}</h1>
                  {active.subtitle && (
                    <p className="italic text-gray-500">{active.subtitle}</p>
                  )}

                  {/* body */}
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
                </>
              )}
            </article>

            {/* ► aside desktop */}
            {related.length > 0 && (
              <aside className="hidden md:block col-start-10 col-span-2 md:pt-[42px]">
                <h3
                  className="uppercase tracking-wider text-sm mb-4"
                  style={{ color: "var(--sectionColor)" }}
                >
                  Explore&nbsp;more
                </h3>
                <ul className="space-y-4">
                  {related.map((r) => {
                    const thumbR = pickThumb(r);
                    return (
                      <li key={r.slug}>
                        <Link
                          href={`/design/${r.slug}`}
                          className="group block"
                        >
                          {thumbR && (
                            <img
                              src={thumbR}
                              alt={r.title}
                              className="w-full aspect-video object-cover rounded-md border border-gray-300 group-hover:border-[var(--accent)] transition"
                              loading="lazy"
                            />
                          )}
                          <span className="mt-1 block text-xs leading-snug group-hover:text-[var(--accent)]">
                            {r.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
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
