import { define, str } from '@/core/cipher/make/define';
import { Fail } from '@/core/cipher/fail';
import { range, rank } from '@/core/cipher/make/rank';
import { alphaRatio, letters, mapAlpha, mod } from '@/core/text/alpha';
import { langs } from '@/core/score/lang';
import { rate } from '@/core/score';
import type { Args } from '@/core/cipher/types';

const shifts = (a: Args) => {
  const k = letters(str(a, 'key'));
  if (!k) throw new Fail('Key needs at least one letter');
  return Array.from(k, (c) => c.charCodeAt(0) - 65);
};

const apply = (s: string, k: number[]) => mapAlpha(s, (i, n) => i - k[n % k.length]);

const run = (s: string, a: Args) => apply(s, shifts(a));

const climb = (head: string, key: number[]) => {
  const k = [...key];
  let top = rate(apply(head, k));
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < k.length; i++) {
      for (let c = 0; c < 26; c++) {
        const t = k.with(i, c);
        const r = rate(apply(head, t));
        if (r > top) {
          top = r;
          k[i] = c;
        }
      }
    }
  }
  return k;
};

const cols = (up: string, len: number) =>
  range(0, len - 1).map((o) => Array.from(up).filter((_, i) => i % len === o).map((c) => c.charCodeAt(0) - 65));

const ic = (col: number[]) => {
  const n = new Array(26).fill(0);
  col.forEach((c) => n[c]++);
  const t = col.length;
  return t < 2 ? 0 : n.reduce((acc, x) => acc + x * (x - 1), 0) / (t * (t - 1));
};

const best = (col: number[], freq: number[]) => {
  let pick = 0;
  let low = Infinity;
  for (let k = 0; k < 26; k++) {
    const n = new Array(26).fill(0);
    col.forEach((c) => n[mod(c - k, 26)]++);
    const chi = n.reduce((acc, x, i) => {
      const e = (col.length * freq[i]) / 100;
      return acc + (x - e) ** 2 / e;
    }, 0);
    if (chi < low) {
      low = chi;
      pick = k;
    }
  }
  return pick;
};

const shrink = (k: string) => {
  for (let l = 1; l < k.length; l++) {
    if (k.length % l === 0 && k.slice(0, l).repeat(k.length / l) === k) return k.slice(0, l);
  }
  return k;
};

const crack = (s: string) => {
  const up = letters(s);
  if (up.length < 16) return [];
  const lens = range(1, Math.min(16, Math.floor(up.length / 8))).map((len) => ({
    len,
    ic: cols(up, len).reduce((acc, c) => acc + ic(c), 0) / len,
  }));
  const top = Math.max(...lens.map((l) => l.ic));
  const pick = [
    ...lens.filter((l) => l.ic >= top * 0.9).slice(0, 3),
    ...[...lens].sort((a, b) => b.ic - a.ic).slice(0, 2),
  ];
  const head = s.slice(0, 300);
  const seeds = new Set(pick.flatMap(({ len }) => langs.map((l) => cols(up, len).map((c) => best(c, l.freq)).join(','))));
  const keys = new Set(
    [...seeds]
      .map((seed) => seed.split(',').map(Number))
      .sort((a, b) => rate(apply(head, b)) - rate(apply(head, a)))
      .slice(0, 3)
      .map((seed) =>
      shrink(
        climb(head, seed)
          .map((x) => String.fromCharCode(65 + x))
          .join(''),
      ),
    ),
  );
  return rank(s, [...keys].map((key) => ({ key })), run, 6);
};

export const vigenere = define({
  id: 'vigenere',
  name: 'Vigenère',
  group: 'classic',
  info: 'Caesar with a keyword: each key letter sets the shift for one letter of the text.',
  params: [{ id: 'key', label: 'Key', kind: 'text', def: 'LEMON' }],
  fits: (s) => alphaRatio(s) >= 0.6 && letters(s).length >= 40,
  decode: run,
  encode: (s, a) => {
    const k = shifts(a);
    return mapAlpha(s, (i, n) => i + k[n % k.length]);
  },
  crack,
});
