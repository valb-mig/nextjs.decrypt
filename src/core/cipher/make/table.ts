import { define } from '@/core/cipher/make/define';
import type { Group } from '@/core/cipher/types';

type Opts = {
  id: string;
  name: string;
  info: string;
  group: Group;
  map: Record<string, string>;
  fits: (s: string) => boolean;
  letter: string;
  word: string;
  words: RegExp;
  letters: RegExp;
  norm?: (s: string) => string;
};

export const MISS = '█';

export const table = ({ map, fits, letter, word, words, letters, norm = (s) => s, ...meta }: Opts) => {
  const back = Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
  return define({
    ...meta,
    fits: (s) => fits(s.trim()),
    decode: (s) =>
      norm(s.trim())
        .split(words)
        .map((w) =>
          w
            .split(letters)
            .filter(Boolean)
            .map((t) => map[t] ?? MISS)
            .join(''),
        )
        .join(' '),
    encode: (s) =>
      s
        .trim()
        .split(/\s+/)
        .map((w) =>
          Array.from(w.toLowerCase())
            .map((c) => back[c])
            .filter(Boolean)
            .join(letter),
        )
        .filter(Boolean)
        .join(word),
  });
};
