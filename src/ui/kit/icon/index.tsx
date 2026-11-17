import { glyphs, type Glyph } from '@/ui/kit/icon/glyphs';

type Run = { x: number; y: number; w: number };

const cache = new Map<Glyph, Run[]>();

const runs = (name: Glyph) => {
  const hit = cache.get(name);
  if (hit) return hit;
  const out: Run[] = [];
  glyphs[name].forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== '#') continue;
      let e = x;
      while (row[e] === '#') e++;
      out.push({ x, y, w: e - x });
      x = e;
    }
  });
  cache.set(name, out);
  return out;
};

type Props = { name: Glyph; size?: number; className?: string };

export function Icon({ name, size = 16, className }: Props) {
  const rows = glyphs[name];
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={(size * h) / w}
      className={className}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {runs(name).map((r) => (
        <rect key={`${r.x}.${r.y}`} x={r.x} y={r.y} width={r.w} height={1} />
      ))}
    </svg>
  );
}

export type { Glyph };
