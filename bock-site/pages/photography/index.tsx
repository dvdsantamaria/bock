import dynamic from "next/dynamic";

const PhotographyPage = dynamic(
  () => import("@/components/PhotographyPage"),
  { ssr: false } // evita hydration warnings por <img>
);

export default function PhotographyIndex() {
  // El componente se encarga de hacer fetch a Strapi y mostrar
  // la primera foto como “intro” (tal como hacía tu JSON local).
  return <PhotographyPage />;
}
