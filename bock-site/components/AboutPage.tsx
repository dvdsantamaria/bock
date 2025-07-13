import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";

import type { AboutBlock } from "@/types/about";

interface Props {
  blocks: AboutBlock[];
  active: AboutBlock;
}

/* --------------- tema --------------- */
const theme = {
  background: "#ffffff",
  accent: "#F8C471",
  menuText: "#000000",
  menuHover: "#F8C471",
  logoText: "#000000",
  sectionColor: "#808080",
};

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function AboutPage({ blocks, active: activeProp }: Props) {
  const active = activeProp ?? blocks[0];

  /* --------------- aplicar tema --------------- */
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);

  /* --------------- render --------------- */
  return (
    <>
      <Head>
        <title>{active.title}</title>
      </Head>

      <MainLayout
        section="about"
        subMenuItems={blocks.map((b) => cap(b.title))}
        theme={theme}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
          >
            {/* aside móvil */}
            {blocks.length > 1 && (
              <div className="col-span-8 md:hidden px-4 pt-4">
                <details className="border border-gray-300 rounded-md bg-white">
                  <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-[var(--menuText)] hover:text-[var(--accent)]">
                    Explore more
                  </summary>
                  <ul className="px-4 py-2 space-y-1">
                    {blocks
                      .filter((b) => b.slug !== active.slug)
                      .map((b) => (
                        <li key={b.slug}>
                          <Link
                            href={`/about/${b.slug}`}
                            className="block text-sm hover:text-[var(--accent)]"
                          >
                            {b.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </details>
              </div>
            )}

            {/* bloque principal */}
            <article
              className="
                col-start-1 col-span-8
                md:col-start-1 md:col-span-8 md:py-10 md:pr-10
                lg:col-start-3 lg:col-span-7
                text-black space-y-6
              "
            >
              <h1 className="text-3xl font-semibold">{active.title}</h1>

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
            {blocks.length > 1 && (
              <aside className="hidden md:block col-start-10 col-span-2 md:pt-[42px]">
                <h3
                  className="uppercase tracking-wider text-sm mb-4"
                  style={{ color: "var(--sectionColor)" }}
                >
                  Explore more
                </h3>
                <ul className="space-y-2">
                  {blocks
                    .filter((b) => b.slug !== active.slug)
                    .map((b) => (
                      <li key={b.slug}>
                        <Link
                          href={`/about/${b.slug}`}
                          className="block text-sm hover:text-[var(--accent)]"
                        >
                          {b.title}
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
