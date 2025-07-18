// pages/index.tsx — Home

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import TopStrokes from "@/components/TopStrokes";

/* Importar funciones de API */
import { getAboutArticles } from "@/lib/about";
import { getDesignArticles } from "@/lib/design";
import { getPhotographyPhotos } from "@/lib/photography";
import { getWritingArticles } from "../lib/writing";

/* helpers */
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const sampleN = <T,>(arr: T[], n: number) =>
  [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

type Thumb = { src: string; href: string; alt: string };

// Normaliza rutas para imágenes
const normalizeImagePath = (path?: string | null): string =>
  path?.startsWith("http") ? path : path ? `/${path.replace(/^\/+/, "")}` : "";

interface HomeProps {
  writingData: any[];
  photoData: any[];
  designData: any[];
  aboutData: any[];
}

export default function Home({
  writingData,
  photoData,
  designData,
  aboutData,
}: HomeProps) {
  const writingLinks = writingData.slice(0, 18).map((a) => ({
    label: a.title,
    href: `/writing/${a.category}/${a.slug}`,
  }));

  const [photoThumbs, setPhotoThumbs] = useState<Thumb[]>([]);
  const [designThumbs, setDesignThumbs] = useState<Thumb[]>([]);
  const [pubThumbs, setPubThumbs] = useState<Thumb[]>([]);

  useEffect(() => {
    setPhotoThumbs(
      sampleN(photoData, 3).map((p) => ({
        src: normalizeImagePath(p.imageThumb),
        href: `/photography/${p.category}/${p.slug}`,
        alt: p.title,
      }))
    );

    setDesignThumbs(
      sampleN(designData, 3).map((d) => {
        let thumb;
        switch (d.thumbPos) {
          case "top":
            thumb = d.imageThumbTop;
            break;
          case "bottom":
            thumb = d.imageThumbBottom;
            break;
          default:
            thumb = d.imageThumbCenter;
        }

        return {
          src: normalizeImagePath(thumb),
          href: `/design/${d.slug}`,
          alt: d.title,
        };
      })
    );

    setPubThumbs(
      sampleN(aboutData, 3).map((p) => ({
        src: normalizeImagePath(p.imageThumb),
        href: `/about#${toSlug(p.title)}`,
        alt: p.title,
      }))
    );
  }, [photoData, designData, aboutData]);

  return (
    <>
      <Head>
        <title>Andrew Bock – Home</title>
      </Head>

      <MainLayout section="" subMenuItems={[]} theme={{}}>
        <TopStrokes />

        <div className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4">
          {/* WRITING */}
          <SectionHeading title="Writing" />
          <ul className="col-span-8 md:col-span-10 md:col-start-3 space-y-1 text-[17px] leading-snug mt-8">
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

export async function getStaticProps() {
  const writingData = await getWritingArticles();
  const photoData = await getPhotographyPhotos();
  const designData = await getDesignArticles();
  const aboutData = await getAboutArticles();

  return {
    props: {
      writingData,
      photoData,
      designData,
      aboutData,
    },
    revalidate: 60,
  };
}

/* ---------- helpers visuales ---------- */
function SectionHeading({ title }: { title: string }) {
  return (
    <h2
      className="col-span-8 md:col-span-2 md:col-start-1 py-4 italic text-2xl md:text-3xl"
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
