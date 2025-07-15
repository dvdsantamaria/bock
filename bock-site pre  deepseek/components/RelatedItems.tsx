/* components/RelatedItems.tsx ------------------------------------------- */
import Link from "next/link";

export interface RelatedItem {
  label: string;
  href: string;
}

interface RelatedItemsProps {
  /** Título que aparece encima de la lista (ej. “Explore more”) */
  title?: string;
  /** Lista de enlaces relacionados  */
  items?: RelatedItem[];
  /** href del enlace activo (se resalta) */
  activeHref?: string;
}

const DUMMY: RelatedItem[] = [
  { label: "Dummy article #1", href: "#" },
  { label: "Another placeholder", href: "#" },
  { label: "Yet another title", href: "#" },
  { label: "Fourth dummy entry", href: "#" },
  { label: "Fifth bit of text", href: "#" },
];

/* ---------------------------------------------------------------------- */
export default function RelatedItems({
  title = "Related",
  items = DUMMY,
  activeHref = "",
}: RelatedItemsProps) {
  return (
    <div className="space-y-4">
      {/* encabezado */}
      <h3 className="uppercase tracking-wider text-[var(--menuText)] text-sm">
        {title}
      </h3>

      {/* lista */}
      <ul className="space-y-2">
        {items.map(({ label, href }) => {
          const isActive = href === activeHref;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`block text-sm leading-snug hover:text-[var(--accent)] ${
                  isActive ? "text-[var(--accent)] font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
