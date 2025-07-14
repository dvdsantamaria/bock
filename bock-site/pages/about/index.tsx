import dynamic from "next/dynamic";

const AboutSection = dynamic(() => import("@/components/AboutPage"), {
  ssr: false, // evita advertencias de hidratación con <Image>
});

export default function AboutIndex() {
  return <AboutSection />;
}
