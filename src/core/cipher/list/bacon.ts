import { define } from '@/core/cipher/make/define';
import { MISS } from '@/core/cipher/make/table';
import { letters } from '@/core/text/alpha';

const code = (i: number) => i.toString(2).padStart(5, '0').replace(/0/g, 'A').replace(/1/g, 'B');

export const bacon = define({
  id: 'bacon',
  name: 'Baconian',
  group: 'code',
  info: "Francis Bacon's cipher: every letter is a group of five A/B symbols.",
  fits: (s) => {
    const n = s.replace(/[^ab]/gi, '').length;
    return /^[ab\s/|]+$/i.test(s.trim()) && n >= 5 && n % 5 === 0;
  },
  decode: (s) =>
    s
      .trim()
      .toUpperCase()
      .split(/\s*[/|]\s*|\s{2,}/)
      .map((w) =>
        (w.replace(/[^AB]/g, '').match(/.{5}/g) ?? [])
          .map((g) => {
            const i = parseInt(g.replace(/A/g, '0').replace(/B/g, '1'), 2);
            return i < 26 ? String.fromCharCode(97 + i) : MISS;
          })
          .join(''),
      )
      .join(' '),
  encode: (s) =>
    s
      .split(/\s+/)
      .map((w) =>
        Array.from(letters(w))
          .map((c) => code(c.charCodeAt(0) - 65))
          .join(' '),
      )
      .filter(Boolean)
      .join(' / '),
});
