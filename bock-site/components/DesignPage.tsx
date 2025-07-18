/* components/DesignPage.tsx */
import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Design } from "@/lib/design";

/* ---------- tema visual ---------- */
const theme: Record<string, string> = {
  background: "#1A1A1A",
  accent: "#EDBE1C",
  menuText: "#ffffff",
  menuHover: "#EDBE1C",
  logoText: "#ffffff",
  sectionColor: "#ffffff",
};

/* ---------- helpers ---------- */
type RTChild = { text: string };
type RTBlock = { type: string; children?: RTChild[] };

/** Elige el thumb correcto en base a thumbPos (o center) */
const pickThumb = (d: Partial<Design>): string | null => {
  const pos = (d.thumbPos ?? "center") as "top" | "center" | "bottom";
  const key = `imageThumb${pos[0].toUpperCase()}${pos.slice(1)}` as
    | "imageThumbTop"
    | "imageThumbCenter"
    | "imageThumbBottom";
  return (d as any)[key] ?? null;
};

type Props = {
  initialData: Design[];
  initialSlug?: string;
};

export default function DesignPage({ initialData, initialSlug }: Props) {
  const { query } = useRouter();
  const slug = (initialSlug ?? query.slug) as string | undefined;

  const data = Array.isArray(initialData) ? initialData : [];
  const active = slug ? data.find((d) => d.slug === slug) ?? data[0] : data[0];
  const related = active
    ? data.filter((d) => d.slug !== active.slug)
    : data.slice(1);

  /* ---------- set CSS vars ---------- */
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
        <title>{active?.title || "Design"}</title>
      </Head>

      <MainLayout section="design" subMenuItems={["", "", ""]} theme={theme}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slug ?? "design-intro"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
          >
            {/* ► imagen principal */}
            <article className="col-start-1 md:col-start-3 col-span-8 md:col-span-7 text-white p-6 md:p-10 space-y-6">
              {active?.imageWatermarked && (
                <img
                  src={active.imageWatermarked}
                  alt={active.title}
                  className="w-full rounded-md border border-gray-300 object-cover"
                />
              )}

              <hr className="border-t-4 border-[var(--accent)] my-6 w-1/2" />
              <h1 className="text-3xl font-semibold">{active?.title}</h1>

              {Array.isArray(active?.body) &&
                active.body.map((block: RTBlock, i) =>
                  block.type === "paragraph" ? (
                    <p key={i}>
                      {block.children?.map((c: RTChild, j) => (
                        <span key={j}>{c.text}</span>
                      ))}
                    </p>
                  ) : null
                )}
            </article>

            {/* ► aside desktop + thumbs */}
            {related.length > 0 && (
              <aside className="hidden md:block col-start-10 col-span-2 md:pt-[42px]">
                <h3
                  className="uppercase tracking-wider text-sm mb-4"
                  style={{ color: "var(--sectionColor)" }}
                >
                  More&nbsp;designs
                </h3>
                <ul className="space-y-4">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/design/${r.slug}`} className="group block">
                        {pickThumb(r) && (
                          <img
                            src={pickThumb(r)!}
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
