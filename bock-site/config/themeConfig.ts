export type Theme = {
  name: string;
  color: string; // Tailwind text-color class (arbitrary value)
  bgColor: string; // Tailwind bg-color class  (arbitrary value)
};

// Tailwind supports arbitrary values with brackets: text-[#HEX]
export const themes: Record<string, Theme> = {
  writing: {
    name: "writing",
    color: "text-[#9FD5B9]", // soft green
    bgColor: "bg-[#9FD5B9]",
  },
  photography: {
    name: "photography",
    color: "text-[#CDE59C]", // light lime
    bgColor: "bg-[#CDE59C]",
  },
  design: {
    name: "design",
    color: "text-[#EDBE1C]", // amber / yellow
    bgColor: "bg-[#EDBE1C]",
  },
  publications: {
    name: "publications",
    color: "text-[#A3A0FF]", // chosen distinct lavender (edit as needed)
    bgColor: "bg-[#A3A0FF]",
  },
};
