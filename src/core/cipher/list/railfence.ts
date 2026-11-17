import { define, int } from '@/core/cipher/make/define';
import { Fail } from '@/core/cipher/fail';
import { range, rank } from '@/core/cipher/make/rank';
import { alphaRatio, chars } from '@/core/text/alpha';
import type { Args } from '@/core/cipher/types';

const rails = (a: Args) => {
  const r = int(a, 'rails', 3);
  if (r < 2) throw new Fail('Needs at least 2 rails');
  return r;
};

const path = (n: number, r: number) => {
  const cycle = 2 * (r - 1);
  return range(0, n - 1).map((p) => {
    const m = p % cycle;
    return m < r ? m : cycle - m;
  });
};

const order = (n: number, r: number) => {
  const p = path(n, r);
  return range(0, r - 1).flatMap((row) => range(0, n - 1).filter((i) => p[i] === row));
};

const run = (s: string, a: Args) => {
  const c = chars(s);
  const out = new Array<string>(c.length);
  order(c.length, rails(a)).forEach((pos, i) => {
    out[pos] = c[i];
  });
  return out.join('');
};

export const railfence = define({
  id: 'railfence',
  name: 'Rail fence',
  group: 'transposition',
  info: 'Writes the text in a zigzag over N rails, then reads rail by rail.',
  params: [{ id: 'rails', label: 'Rails', kind: 'int', min: 2, max: 20, def: 3 }],
  fits: (s) => s.length >= 6 && alphaRatio(s) >= 0.5,
  decode: run,
  encode: (s, a) => {
    const c = chars(s);
    return order(c.length, rails(a))
      .map((i) => c[i])
      .join('');
  },
  crack: (s) => {
    const n = chars(s).length;
    return n < 4 ? [] : rank(s, range(2, Math.min(20, Math.floor(n / 2))).map((r) => ({ rails: r })), run, 8, true);
  },
});
