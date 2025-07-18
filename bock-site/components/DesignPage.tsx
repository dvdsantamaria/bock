import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Design } from "@/lib/design";

const theme = {
  background: "#1A1A1A",
  accent: "#EDBE1C",
  menuText: "#ffffff",
  menuHover: "#EDBE1C",
  logoText: "#ffffff",
  sectionColor: "#ffffff",
};

type Props = {
  initialData: Design[];
  initialSlug?: string;
};

type RichTextChild = {
  text: string;
};

type RichTextBlock = {
  type: string;
  children?: RichTextChild[];
};

export default function DesignPage({ initialData, initialSlug }: Props) {
  const { query } = useRouter();
  const routerSlug = query.slug as string | undefined;
  const slug = initialSlug ?? routerSlug;

  const data = Array.isArray(initialData) ? initialData : [];

  const active = slug ? data.find((a) => a.slug === slug) : data[0];

  const related = data.filter((a) => a.slug !== active?.slug);

  const imageThumb =
    active?.thumbPos === "top"
      ? active.imageThumbTop
      : active?.thumbPos === "bottom"
      ? active.imageThumbBottom
      : active?.imageThumbCenter;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);

  return (
    <>
      <Head>
        <title>{active?.title || "Design"}</title>
      </Head>

      <MainLayout section="design" subMenuItems={["", "", ""]} theme={theme}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slug ?? "design-default"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
          >
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
                active.body.map((block: RichTextBlock, i: number) =>
                  block.type === "paragraph" ? (
                    <p key={i}>
                      {block.children?.map(
                        (child: RichTextChild, j: number) => (
                          <span key={j}>{child.text}</span>
                        )
                      )}
                    </p>
                  ) : null
                )}
            </article>

            {related.length > 0 && (
              <aside className="hidden md:block col-start-10 col-span-2 md:pt-[42px]">
                <h3
                  className="uppercase tracking-wider text-sm mb-4"
                  style={{ color: "var(--sectionColor)" }}
                >
                  More&nbsp;designs
                </h3>
                <ul className="space-y-4">
                  {related.map((r) => {
                    const thumb =
                      r.thumbPos === "top"
                        ? r.imageThumbTop
                        : r.thumbPos === "bottom"
                        ? r.imageThumbBottom
                        : r.imageThumbCenter;

                    return (
                      <li key={r.slug}>
                        <Link
                          href={`/design/${r.slug}`}
                          className="group block"
                        >
                          {thumb && (
                            <img
                              src={thumb}
                              alt={r.title}
                              className="w-full aspect-video object-cover rounded-md border border-gray-300 group-hover:border-[var(--accent)] transition"
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
