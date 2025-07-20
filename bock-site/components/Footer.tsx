export default function Footer() {
  return (
    <footer className="col-span-12 mt-12">
      {/* ───── lime strokes ───── */}
      <div className="relative h-[7px] grid grid-cols-12 gap-x-4">
        <div className="col-start-1  col-span-2  bg-[var(--accent)] h-full" />
        <div className="col-start-3  col-span-8  bg-[var(--accent)] h-full" />
        <div className="col-start-11 col-span-1 bg-[var(--accent)] h-full" />
        <div className="absolute right-0 top-0 w-[7px] h-full bg-[var(--accent)]" />
      </div>

      {/* ───── meta info (Contact · Copyright) ───── */}
      <div className="grid grid-cols-12 text-sm py-8 text-[var(--menu-text)]">
        <p className="col-start-1 col-span-3">Contact</p>
        <p className="col-start-9 col-span-5 ">
          © Copyright Andrew Bock 2025. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
