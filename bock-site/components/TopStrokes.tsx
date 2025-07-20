/* components/TopStrokes.tsx
   – una sola línea de strokes idéntica a la del footer,
     pensada para colocarse justo debajo del header. */

export default function TopStrokes() {
  return (
    <div className="col-span-12">
      <div className="relative h-[7px] grid grid-cols-12 gap-x-4">
        {/* 2 columnas a la izquierda */}
        <div className="col-start-1  col-span-2  bg-[var(--accent)] h-full" />
        {/* tramo central largo */}
        <div className="col-start-3  col-span-8  bg-[var(--accent)] h-full" />
        {/* tramo corto antes del margen derecho */}
        <div className="col-start-11 col-span-1 bg-[var(--accent)] h-full" />
        {/* mini-stroke extremo derecho */}
        <div className="absolute right-0 top-0 w-[7px] h-full bg-[var(--accent)]" />
      </div>
    </div>
  );
}
