/* pages/index.tsx — Home */

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import TopStrokes from "@/components/TopStrokes";

/* Import helpers de API */
import { getAboutArticles } from "@/lib/about";
import { getDesignArticles } from "@/lib/design";
import { getPhotographyPhotos } from "@/lib/photography";
import { getWritingArticles } from "@/lib/writing";

/* utilidades */
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const normalizeImagePath = (path?: string | null): string =>
  path?.startsWith("http") ? path : path ? `/${path.replace(/^\/+/, "")}` : "";

/* ─── type helpers ─── */
type Thumb = { src: string; href: string; alt: string };

const sampleN = <T,>(arr: T[], n: number, hasImg: (item: T) => boolean) => {
  const withImg = arr.filter(hasImg);
  return [...withImg]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(n, withImg.length));
};

/* ─── props ─── */
interface HomeProps {
  writingData: any[];
  photoData: any[];
  designData: any[];
  aboutData: any[];
}

/* ─── componente ─── */
export default function Home({
  writingData,
  photoData,
  designData,
  aboutData,
}: HomeProps) {
  /* links de Writing (solo texto) */
  const writingLinks = writingData.slice(0, 18).map((a) => ({
    label: a.title,
    href: `/writing/${a.category}/${a.slug}`,
  }));

  /* thumbnails */
  const [photoThumbs, setPhotoThumbs] = useState<Thumb[]>([]);
  const [designThumbs, setDesignThumbs] = useState<Thumb[]>([]);
  const [pubThumbs, setPubThumbs] = useState<Thumb[]>([]);

  useEffect(() => {
    /* PHOTOGRAPHY – usa imageThumbCenter o cualquier thumb que exista */
    setPhotoThumbs(
      sampleN(
        photoData,
        3,
        (p: any) => p.imageThumbCenter || p.imageThumbTop || p.imageThumbBottom
      ).map((p: any) => ({
        src: normalizeImagePath(
          p.imageThumbCenter || p.imageThumbTop || p.imageThumbBottom
        ),
        href: `/photography/${p.category}/${p.slug}`,
        alt: p.title,
      }))
    );

    /* DESIGN – prioriza center > top > bottom > imageFull */
    setDesignThumbs(
      sampleN(
        designData,
        3,
        (d: any) =>
          d.imageThumbCenter ||
          d.imageThumbTop ||
          d.imageThumbBottom ||
          d.imageFull
      ).map((d: any) => {
        const thumb =
          d.imageThumbCenter ||
          d.imageThumbTop ||
          d.imageThumbBottom ||
          d.imageFull;
        return {
          src: normalizeImagePath(thumb),
          href: `/design/${d.slug}`,
          alt: d.title,
        };
      })
    );

    /* PUBLICATIONS */
    setPubThumbs(
      sampleN(aboutData, 3, (p: any) => p.imageThumb || p.imageFull).map(
        (p: any) => ({
          src: normalizeImagePath(p.imageThumb || p.imageFull),
          href: `/about#${toSlug(p.title)}`,
          alt: p.title,
        })
      )
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

/* ─── getStaticProps ─── */
export async function getStaticProps() {
  const [writingData, photoData, designData, aboutData] = await Promise.all([
    getWritingArticles(),
    getPhotographyPhotos(),
    getDesignArticles(),
    getAboutArticles(),
  ]);

  return {
    props: { writingData, photoData, designData, aboutData },
    revalidate: 60,
  };
}

/* ─── helpers visuales ─── */
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
