import Link from "next/link";

/** Orientation of the list */
type Variant = "vertical" | "inline";

interface SidebarProps {
  /** Current top-level section slug (eg. "writing")  */
  active?: string;
  /** Layout variant */
  variant?: Variant;
}

const items = ["Writing", "Media Design", "Photography", "About"];

export default function Sidebar({
  active = "",
  variant = "vertical",
}: SidebarProps) {
  const base =
    variant === "vertical"
      ? "flex flex-col items-end space-y-2"
      : "flex gap-8 items-center";

  return (
    <nav
      className={`${base} text-xs uppercase tracking-wide select-none whitespace-nowrap`}
    >
      {items.map((label) => {
        const slug = label.toLowerCase().replace(/\s+/g, "-");
        const isActive = active === slug;

        return (
          <Link
            key={slug}
            href={`/${slug}`}
            className={
              isActive
                ? "text-white"
                : "text-gray-400 hover:text-white transition-colors"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
