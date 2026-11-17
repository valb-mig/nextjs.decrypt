import { rate } from '@/core/score';
import type { Args, Guess } from '@/core/cipher/types';

type Run = (s: string, a: Args) => string;

export const rank = (src: string, list: Args[], run: Run, keep = 10, whole = false): Guess[] => {
  const head = whole ? src : src.slice(0, 300);
  return list
    .map((args) => ({ args, score: rate(run(head, args)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, keep)
    .map((g) => ({ ...g, text: run(src, g.args) }));
};

export const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
