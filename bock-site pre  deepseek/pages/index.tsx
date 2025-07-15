/* pages/index.tsx — Home */
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import TopStrokes from "@/components/TopStrokes";

/* data */
import writing from "@/data/writing.json";
import photos from "@/data/photography.json";
import design from "@/data/design.json";
import about from "@/data/about.json";

/* helpers */
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
const sampleN = <T,>(arr: T[], n: number) =>
  [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
type Thumb = { src: string; href: string; alt: string };

export default function Home() {
  /* -------- links escritura -------- */
  const writingLinks = writing.articles.slice(0, 18).map((a) => ({
    label: a.title,
    href: `/writing/${a.category}/${a.slug}`,
  }));

  /* -------- thumbs aleatorios (cliente) -------- */
  const [photoThumbs, setPhotoThumbs] = useState<Thumb[]>([]);
  const [designThumbs, setDesignThumbs] = useState<Thumb[]>([]);
  const [pubThumbs, setPubThumbs] = useState<Thumb[]>([]);

  useEffect(() => {
    setPhotoThumbs(
      sampleN(photos.articles, 3).map((p) => ({
        src: "/" + p.imageThumb.replace(/^\/+/, ""),
        href: `/photography/${p.category}/${p.slug}`,
        alt: p.title,
      }))
    );
    setDesignThumbs(
      sampleN(design.articles, 3).map((d) => ({
        src: "/" + d.imageThumb.replace(/^\/+/, ""),
        href: `/design/${d.slug}`,
        alt: d.title,
      }))
    );
    setPubThumbs(
      sampleN(about.articles, 3).map((p) => ({
        src: "/" + p.imageThumb.replace(/^\/+/, ""),
        href: `/about#${toSlug(p.title)}`,
        alt: p.title,
      }))
    );
  }, []);

  return (
    <>
      <Head>
        <title>Andrew Bock – Home</title>
      </Head>

      {/* NO sub-menú: section y subMenuItems vacíos */}
      <MainLayout section="" subMenuItems={[]} theme={{}}>
        {/* ── strokes superiores ─────────────────────── */}
        <TopStrokes />

        {/* ── contenido ─────────────────────────────── */}
        <div className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4">
          {/* WRITING */}
          <SectionHeading title="Writing" />
          <ul className="col-span-8 md:col-span-10 md:col-start-3 space-y-1 text-[17px] leading-snug">
            {writingLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[var(--accent)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* PHOTOGRAPHY */}
          <SectionHeading title="Photography" />
          <ThumbRow thumbs={photoThumbs} />

          {/* DESIGN */}
          <SectionHeading title="Design" />
          <ThumbRow thumbs={designThumbs} />

          {/* PUBLICATIONS */}
          <SectionHeading title="Publications" />
          <ThumbRow thumbs={pubThumbs} />

          <Footer />
        </div>
      </MainLayout>
    </>
  );
}

/* ---------- helpers visuales ---------- */
function SectionHeading({ title }: { title: string }) {
  return (
    <h2
      className="col-span-8 md:col-span-2 md:col-start-1 pt-8 italic text-2xl md:text-3xl"
      style={{
        fontFamily: `"Palatino Linotype","Book Antiqua",Palatino,serif`,
      }}
    >
      {title}
    </h2>
  );
}

function ThumbRow({ thumbs }: { thumbs: Thumb[] }) {
  return (
    <>
      {thumbs.map((t, i) => (
        <div
          key={t.href}
          className={`col-span-8 md:col-span-2 ${
            i === 0 ? "md:col-start-3" : ""
          } py-4`}
        >
          <Link href={t.href} className="block group">
            <img
              src={t.src}
              alt={t.alt}
              className="w-full aspect-video object-cover border border-gray-300 rounded-md group-hover:border-[var(--accent)] transition"
            />
          </Link>
        </div>
      ))}
    </>
  );
}
