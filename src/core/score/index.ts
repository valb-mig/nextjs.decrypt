import { letters, plain } from '@/core/text/alpha';
import { B64, models, Q, SYM } from '@/core/score/model';
import { words } from '@/core/score/words';

const CAP = 400;
const clamp = (x: number) => Math.min(1, Math.max(0, x));

const tables = models.map((m) => ({ ...m, q: Uint8Array.from(m.tri, (c) => B64.indexOf(c)) }));

const printable = (c: string) => /[\p{L}\p{N}\p{P}\p{Zs}\p{Sm}\p{Sc}\p{Sk}\n\r\t]/u.test(c) && c !== '�';

const norm = (s: string) =>
  plain(s)
    .toLowerCase()
    .replace(/[^a-z]+/g, ' ')
    .trim();

const sym = (c: string) => (c === ' ' ? 0 : c.charCodeAt(0) - 96);

const flow = (s: string) => {
  const t = ` ${norm(s)} `;
  if (t.length < 5) return 0;
  const k = t.trim().includes(' ') ? 0 : 1;
  return Math.max(
    ...tables.map((m) => {
      let sum = 0;
      for (let i = 2; i < t.length; i++) sum += m.q[(sym(t[i - 2]) * SYM + sym(t[i - 1])) * SYM + sym(t[i])];
      const b = sum / Q / (t.length - 2);
      return clamp((m.rand[k] - b) / (m.rand[k] - m.lang[k]));
    }),
  );
};

const cover = (s: string) => {
  const toks = norm(s).split(' ');
  let all = 0;
  let hit = 0;
  for (const t of toks) {
    all += t.length;
    if (words.has(t)) hit += t.length === 1 ? 0.5 : t.length;
  }
  return all ? hit / all : 0;
};

const odd = (s: string) => {
  const caps = s.match(/[a-z][A-Z]/g)?.length ?? 0;
  const mix = s.match(/[a-z]\d|\d[a-z]/gi)?.length ?? 0;
  return clamp(1 - (caps * 3 + mix * 5) / Math.max(1, letters(s).length));
};

export const rate = (src: string) => {
  const s = Array.from(src.slice(0, CAP * 2)).slice(0, CAP).join('');
  const all = Array.from(s);
  if (!all.length) return 0;
  const ok = all.filter(printable).length / all.length;
  if (ok < 0.75) return 0;
  const solid = s.replace(/\s/g, '');
  if (!solid.length) return 0;
  const up = letters(s);
  const alpha = up.length / solid.length;
  const lang = /\s/.test(s.trim()) ? 0.75 * flow(s) + 0.25 * cover(s) : flow(s);
  const short = clamp(up.length / 12);
  return clamp(ok ** 6 * (0.35 + 0.65 * alpha) * lang * odd(s) * (0.5 + 0.5 * short));
};
