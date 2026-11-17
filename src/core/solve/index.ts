import { ciphers } from '@/core/cipher';
import { rate } from '@/core/score';
import type { Args, Cipher, Guess } from '@/core/cipher/types';

export type Step = { id: string; name: string; args: Args };

export type Hit = { text: string; steps: Step[]; score: number };

type Opts = { depth?: number; width?: number; limit?: number; floor?: number };

const keyed = (c: Cipher) => c.group === 'classic' || c.group === 'transposition';

const loose = ciphers.filter((c) => !keyed(c));

const expand = (c: Cipher, text: string): Omit<Guess, 'score'>[] => {
  if (!c.fits(text)) return [];
  if (c.crack) return c.crack(text).slice(0, 2);
  if (c.params.length) return [];
  try {
    return [{ args: {}, text: c.decode(text, {}) }];
  } catch {
    return [];
  }
};

const GAIN = 0.2;

const packed = (t: string) => /\d/.test(t) && !/\s/.test(t.trim()) && loose.some((c) => c.fits(t));

const open = (h: Hit) => {
  const last = h.steps.at(-1);
  const sure = last && loose.some((c) => c.id === last.id);
  return h.score + (loose.some((c) => c.fits(h.text)) ? 0.5 : 0) + (sure ? 0.3 : 0);
};

export const solve = (src: string, { depth = 3, width = 8, limit = 8, floor = 0.3 }: Opts = {}): Hit[] => {
  const input = src.replace(/[\r\n]+$/, '');
  if (!input.trim()) return [];
  const seen = new Set([input.trim()]);
  const hits: Hit[] = [];
  let level: Hit[] = [{ text: input, steps: [], score: rate(input) }];
  for (let d = 0; d < depth && level.length; d++) {
    const next: Hit[] = [];
    for (const node of level) {
      if (node.score > 0.75) continue;
      const last = node.steps.at(-1);
      const prev = last && ciphers.find((c) => c.id === last.id);
      const bare = packed(node.text);
      for (const c of ciphers) {
        if (prev && (prev.id === c.id || (keyed(prev) && keyed(c)))) continue;
        if (bare && keyed(c)) continue;
        for (const g of expand(c, node.text)) {
          const text = g.text;
          const key = text.trim();
          if (!key || seen.has(key)) continue;
          const score = rate(text);
          if (keyed(c) && score < node.score + GAIN) continue;
          seen.add(key);
          next.push({ text, steps: [...node.steps, { id: c.id, name: c.name, args: g.args }], score });
        }
      }
    }
    hits.push(...next);
    level = next.sort((a, b) => open(b) - open(a)).slice(0, width);
  }
  return hits
    .map((h) => ({ ...h, text: h.text.trim(), score: Math.max(0, h.score - 0.01 * (h.steps.length - 1)) }))
    .filter((h) => h.score >= floor)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const wrap = (src: string, steps: [string, Args?][]) =>
  steps.reduce((acc, [id, args]) => {
    const c = ciphers.find((x) => x.id === id);
    return c ? c.encode(acc, args ?? {}) : acc;
  }, src);
