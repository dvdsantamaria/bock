import React, { useEffect } from "react";
import Head from "next/head";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const theme = {
  background: "#A7A9AC",
  accent: "#EDBE1C",
  menuText: "#000000",
  menuHover: "#EDBE1C",
  logoText: "#000000",
  sectionColor: "#000000",
};

export default function MediaDesignPage() {
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () => {
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
    };
  }, []);

  return (
    <>
      <Head>
        <title>Media Design</title>
      </Head>

      <MainLayout
        section="media design"
        subMenuItems={["", "", ""]}
        theme={theme}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="media-design" // fuerza reinicio de animación al cambiar de contenido
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-12 grid grid-cols-12 gap-x-4"
          >
            {/* ---------------- GRID 12 COLS ---------------- */}
            <div className="col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4">
              {/* ---------- contenido principal (3–10) ---------- */}
              <article className="col-span-8 md:col-start-3 md:col-span-7 text-black p-6 md:p-10 space-y-6">
                <h1 className="text-3xl font-semibold">Design</h1>
                <p className="leading-relaxed tracking-tight whitespace-pre-wrap">
                  Media design is about the inspired meeting of medium, message
                  and audience - content, function and form. Too much media
                  design, however, is driven by marketing. It sells a product or
                  service but doesn't engage readers or watchers. It's empty
                  media. And is often valued more by advertisers than readers.
                  Andrew has designed football cards for the AFL, vinyl adhesive
                  posters to carry art on public transport, a winery brochure
                  still valued as an educational guide to wine, a personalised
                  tourist map of the best destinations in a region and a graphic
                  tide chart that hangs in coastal holiday homes and runs on
                  website weather pages around Australia. These media all carry
                  content that people wanted to read, buy and keep. Content will
                  find a great new medium much like function will find great
                  form, if the producer is open to possibilities. The audience
                  is often the key, as are the intellectual assets of every
                  business and organisation when packaged into a great media
                  product. Working with craftspeople, Andrew has also designed
                  clothing, furniture, kitchen and sports equipment. Media
                  design and product design are united by the solution that
                  leads to a new form, albeit a form that engages with past and
                  archetypal forms. Media is a product, but products also have
                  stories. In a world overloaded by media, messages and objects,
                  Andrew aims to design things that have a simplicity and
                  dissolve the need for other products or objects. He is
                  influenced by the way evolutionary processes in nature
                  simplify as they strengthen forms. He likes Da Vinci's
                  definition of inventors as "interpreters between nature and
                  humans".
                </p>
              </article>

              {/* ---------- thumbnails barra derecha (11-12) ---------- */}
              {/* -------- aside DESKTOP -------- */}
              <aside className="hidden md:block col-start-10 col-span-2 pt-8">
                <h3
                  className="uppercase tracking-wider text-sm mb-4"
                  style={{ color: "var(--sectionColor)" }}
                >
                  Projects
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="w-full aspect-video bg-white border border-gray-300 text-gray-500 text-xs flex items-center justify-center"
                    >
                      thumbnail {n}
                    </div>
                  ))}
                </div>
              </aside>

              {/* -------- aside MOBILE CAROUSEL (arriba del artículo) -------- */}
              <div className="md:hidden col-span-8 order-first px-4 pt-6">
                <h3
                  className="uppercase tracking-wider text-sm mb-3"
                  style={{ color: "var(--sectionColor)" }}
                >
                  Projects
                </h3>
                <div className="relative">
                  <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2 snap-x snap-mandatory">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="min-w-[80%] snap-center aspect-video bg-white border border-gray-300 text-gray-500 text-xs flex items-center justify-center rounded"
                      >
                        thumbnail {n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </motion.div>
        </AnimatePresence>
      </MainLayout>
    </>
  );
}
