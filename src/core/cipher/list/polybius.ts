import { define } from '@/core/cipher/make/define';
import { Fail } from '@/core/cipher/fail';
import { MISS } from '@/core/cipher/make/table';
import { letters } from '@/core/text/alpha';

const SQ = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';

export const polybius = define({
  id: 'polybius',
  name: 'Polybius square',
  group: 'code',
  info: '5×5 grid (I and J share a cell). Each letter is its row and column, 11 to 55.',
  fits: (s) => {
    const t = s.trim();
    return /^[1-5\s/|]+$/.test(t) && t.split(/[\s/|]+/).every((x) => x.length % 2 === 0) && t.replace(/\D/g, '').length >= 4;
  },
  decode: (s) =>
    s
      .trim()
      .split(/\s*[/|]\s*|\s{2,}/)
      .map((w) => {
        const d = w.replace(/\s/g, '');
        if (d.length % 2) throw new Fail('Polybius needs digit pairs');
        return (d.match(/../g) ?? [])
          .map((p) => {
            const r = +p[0] - 1;
            const c = +p[1] - 1;
            return r >= 0 && r < 5 && c >= 0 && c < 5 ? SQ[r * 5 + c].toLowerCase() : MISS;
          })
          .join('');
      })
      .join(' '),
  encode: (s) =>
    s
      .split(/\s+/)
      .map((w) =>
        Array.from(letters(w).replace(/J/g, 'I'))
          .map((c) => {
            const i = SQ.indexOf(c);
            return `${Math.floor(i / 5) + 1}${(i % 5) + 1}`;
          })
          .join(' '),
      )
      .filter(Boolean)
      .join(' / '),
});
