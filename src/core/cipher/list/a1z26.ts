import { define } from '@/core/cipher/make/define';
import { MISS } from '@/core/cipher/make/table';
import { letters } from '@/core/text/alpha';

const nums = (s: string) => s.match(/\d+/g)?.map(Number) ?? [];

export const a1z26 = define({
  id: 'a1z26',
  name: 'A1Z26',
  group: 'code',
  info: 'Each letter becomes its position in the alphabet: A=1 … Z=26.',
  fits: (s) => {
    const t = s.trim();
    const n = nums(t);
    return /^\d{1,2}([\s,.\-/|]+\d{1,2})+$/.test(t) && n.every((v) => v >= 1 && v <= 26);
  },
  decode: (s) => {
    const t = s.trim();
    const dash = /\d-\d/.test(t);
    const words = dash ? t.split(/[\s/|]+/) : t.split(/\s*[/|]\s*|\s{2,}/);
    return words
      .map((w) =>
        nums(w)
          .map((v) => (v >= 1 && v <= 26 ? String.fromCharCode(96 + v) : MISS))
          .join(''),
      )
      .join(' ');
  },
  encode: (s) =>
    s
      .split(/\s+/)
      .map((w) =>
        Array.from(letters(w))
          .map((c) => c.charCodeAt(0) - 64)
          .join('-'),
      )
      .filter(Boolean)
      .join(' '),
});
