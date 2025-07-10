import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ---------- tipos ---------- */
interface Article {
  id: number;
  title: string;
  subtitle?: string;
  body: any; // puede venir como string o array de bloques
  slug: string;
  imageThumb?: string;
  imageFull?: string;
}

interface Intro {
  title: string;
  subtitle?: string;
  body: any; // igual que arriba
  heroImage?: string;
}

/* ---------- tema local ---------- */
const theme = {
  background: "#A7A9AC",
  accent: "#EDBE1C",
  menuText: "#000000",
  menuHover: "#EDBE1C",
  logoText: "#000000",
  sectionColor: "#000000",
};

/* ---------- helpers ---------- */
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function AboutSection() {
  const { query } = useRouter();
  const { slug } = query as { slug?: string };

  /* ----- estado para datos ----- */
  const [intro, setIntro] = useState<Intro | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  /* ----- fetch desde Strapi ----- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // single type
        const introRes = await fetch(`${API}/api/about-intro?populate=*`);
        const introJson = await introRes.json();
        const introRaw = introJson.data;
        setIntro({
          title: introRaw.title,
          subtitle: introRaw.subtitle,
          body: introRaw.content, // <— campo correcto
          heroImage: introRaw.heroImage?.url
            ? `${API}${introRaw.heroImage.url}`
            : undefined,
        });

        // collection
        const artRes = await fetch(
          `${API}/api/abouts?populate=*&pagination[pageSize]=100`
        );
        const artJson = await artRes.json();

        const mapped = artJson.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          body: item.body || item.content,
          slug: item.slug,
          imageThumb: item.imageThumb?.url
            ? `${API}${item.imageThumb.url}`
            : undefined,
          imageFull: item.imageFull?.url
            ? `${API}${item.imageFull.url}`
            : undefined,
        }));

        setArticles(mapped);
      } catch (err) {
        console.error("Error fetching Strapi data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ----- set CSS custom-props (tema) ----- */
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);

  if (loading || !intro) return <div className="p-10">Loading…</div>;

  /* ----- cuál es el artículo activo ----- */
  const active =
    slug && typeof slug === "string"
      ? articles.find((a) => a.slug === slug) ?? intro
      : intro;

  /* ----- aside / explore-more ----- */
  const related =
    active === intro ? articles : articles.filter((a) => a.slug !== slug);

  /* ---------- render ---------- */
  return (
    <>
      <Head>
        <title>{active.title}</title>
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
            {/* -------- dropdown Explore-more (mobile) -------- */}
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

            {/* -------- artículo principal -------- */}
            <article className="col-start-1 md:col-start-3 col-span-8 md:col-span-7 text-black p-6 md:p-10 space-y-6">
              {("imageFull" in active || "heroImage" in active) &&
                (active.imageFull || active.heroImage) &&
                slug && (
                  <img
                    src={
                      (active as Article).imageFull ||
                      (active as Intro).heroImage
                    }
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

            {/* -------- aside (desktop) -------- */}
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
                      <Link
                        href={`/about/${r.slug}`}
                        className="group block" /* navegación interna */
                      >
                        {r.imageThumb && (
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
