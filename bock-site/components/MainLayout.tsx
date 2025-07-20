/* components/MainLayout.tsx */
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

/* ─────────── Types ─────────── */
export interface ThemeColors {
  background: string;
  accent: string;
  menuText: string;
  menuHover: string;
  logoText: string;
  sectionColor: string;
}
interface MainLayoutProps {
  children: React.ReactNode;
  section?: string;
  subMenuItems?: string[];
  theme?: Partial<ThemeColors>;
}

/* ─────────── Component ─────────── */
export default function MainLayout({
  children,
  section = "",
  subMenuItems = [],
  theme = {},
}: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* palette (con fallback) */
  const {
    background = "#A7A9AC",
    accent = "#CDE59C",
    menuText = "#000000",
    menuHover = "#CDE59C",
    logoText = "#000000",
    sectionColor = "#cccccc",
  } = theme;

  /* helpers */
  const TOP_MENU = ["Writing", "Media Design", "Photography", "About"];
  const buildSlug = (s: string) =>
    s.toLowerCase() === "media design"
      ? "design"
      : s.toLowerCase().replace(/\s+/g, "-");

  const router = useRouter();
  const [currentMain, currentSub] = router.asPath
    .split("/")
    .filter(Boolean)
    .map((p) => p.toLowerCase());

  /* ─────────── render ─────────── */
  return (
    <div
      className="min-h-screen font-sans"
      style={
        {
          "--background": background,
          "--accent": accent,
          "--menu-text": menuText,
          "--menu-hover": menuHover,
          "--logo-text": logoText,
          "--section-color": sectionColor,
          background: "var(--background)",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto w-full max-w-[940px] lg:max-w-screen-xl px-4 grid grid-cols-8 md:grid-cols-12">
        {/* ══ HEADER ═══════════════════════════════════ */}
        <header className="col-span-12 grid grid-cols-12 items-center min-h-[108px]">
          {/* mini-strokes */}
          <div className="col-span-12 relative h-[7px] grid grid-cols-12 gap-x-4">
            <div className="col-start-1 w-[7px] h-full bg-[var(--accent)]" />
            <div className="col-start-5 w-[7px] h-full bg-[var(--accent)]" />
            <div className="col-start-7 w-[7px] h-full bg-[var(--accent)]" />
            <div className="absolute right-0 top-0 w-[7px] h-full bg-[var(--accent)]" />
          </div>

          {/* logo */}
          <div className="col-span-2 flex items-center select-none">
            <Link href="/" aria-label="Home">
              <Image
                src="/logo.svg"
                alt="Andrew Bock logo"
                width={180}
                height={90}
                priority
              />
            </Link>
          </div>

          <div className="col-span-7" />

          {/* menú desktop */}
          <nav className="col-start-10 col-span-2 hidden md:flex flex-col space-y-1 text-xs uppercase tracking-wide my-2">
            {TOP_MENU.map((label) => {
              const slug = buildSlug(label);
              const active = slug === currentMain;
              return (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className={`w-full px-2 py-[2px] transition-colors ${
                    active
                      ? "bg-[#5f5f57] text-white"
                      : "text-[var(--menu-text)] hover:bg-[var(--menu-hover)]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* burger mobile */}
          <div className="col-span-2 md:hidden flex justify-end items-center mt-2">
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="p-2 text-[var(--menu-text)]"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </header>

        {/* ══ MENÚ MOBILE ═════════════════════════════ */}
        {mobileMenuOpen && (
          <div className="md:hidden col-span-12 bg-[var(--background)] border-y border-[var(--accent)] py-4 px-4 space-y-3 text-base uppercase tracking-wide">
            {TOP_MENU.map((label) => {
              const slug = buildSlug(label);
              const active = slug === currentMain;

              return (
                <React.Fragment key={slug}>
                  {/* main item */}
                  <Link
                    href={`/${slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-center py-1.5 pr-2 transition-colors"
                  >
                    <span
                      className={`w-[5px] h-4 mr-3 ${
                        active
                          ? "bg-[var(--accent)]"
                          : "bg-gray-300 group-hover:bg-[var(--accent)]"
                      }`}
                    />
                    <span
                      className={`${
                        active ? "font-semibold" : ""
                      } text-[var(--menu-text)]`}
                    >
                      {label}
                    </span>
                  </Link>

                  {/* sub-items bajo su padre */}
                  {active && subMenuItems.length > 0 && (
                    <nav className="space-y-1 pl-8">
                      {subMenuItems.map((item) => {
                        const subSlug = buildSlug(item);
                        const activeSub = subSlug === currentSub;
                        return (
                          <Link
                            key={subSlug}
                            href={`/${slug}/${subSlug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block py-1 text-sm ${
                              activeSub
                                ? "font-semibold text-[var(--accent)]"
                                : "text-[var(--menu-text)] hover:text-[var(--accent)]"
                            }`}
                          >
                            {item}
                          </Link>
                        );
                      })}
                    </nav>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* ══ SUB-MENÚ DESKTOP (strokes) ═════════════ */}
        {(section || subMenuItems.length > 0) && (
          <div className="col-span-12 grid grid-cols-12 grid-rows-[6px_auto_6px] gap-x-0 md:gap-x-4 text-xs tracking-wider relative">
            {[
              { label: section, isSection: true },
              ...subMenuItems.map((l) => ({ label: l, isSection: false })),
            ].map((item, i) => {
              const start = i * 2 + 1;
              const base =
                "row-start-2 px-2 py-[6px] whitespace-nowrap flex items-center";
              return (
                <React.Fragment key={i}>
                  <div
                    className="row-start-1 col-span-2 h-[7px] bg-[var(--accent)]"
                    style={{ gridColumnStart: start }}
                  />
                  <div
                    className="row-start-3 col-span-2 h-[3px] bg-[var(--accent)]"
                    style={{ gridColumnStart: start }}
                  />

                  {item.isSection ? (
                    <h2
                      className={`col-span-12 md:col-span-2 ${base}`}
                      style={{
                        gridColumnStart: start,
                        fontFamily: `"Palatino Linotype","Book Antiqua",Palatino,serif`,
                        fontStyle: "italic",
                        fontSize: "1.5rem",
                        color: sectionColor,
                        paddingLeft: "10px",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.label}
                    </h2>
                  ) : (
                    <Link
                      href={`/${currentMain}/${buildSlug(item.label)}`}
                      className={`hidden md:flex col-span-2 ${base} font-bold uppercase hover:text-[var(--accent)]`}
                      style={{
                        gridColumnStart: start,
                        fontFamily: `"Palatino Linotype","Book Antiqua",Palatino,serif`,
                        fontSize: ".8rem",
                        color: "var(--menu-text)",
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}

            {/* stroke continuo */}
            <div className="hidden lg:block row-start-1 col-start-9 col-span-3 h-[7px] bg-[var(--accent)]" />
            <div className="hidden lg:block row-start-3 col-start-9 col-span-3 h-[3px] bg-[var(--accent)]" />

            <div className="absolute right-0 top-0 w-[7px] h-[7px] bg-[var(--accent)]" />
            <div className="absolute right-0 bottom-0 w-[7px] h-[3px] bg-[var(--accent)]" />
          </div>
        )}

        {/* ══ MAIN ════════════════════════════════════ */}
        <main className="col-span-8 md:col-span-12">{children}</main>
      </div>
    </div>
  );
}
