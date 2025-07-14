import dynamic from "next/dynamic";

const AboutSection = dynamic(() => import("@/components/AboutPage"), {
  ssr: false,
});

export default function AboutSlug() {
  return <AboutSection />;
}
