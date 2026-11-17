import { define, int } from '@/core/cipher/make/define';
import { Fail } from '@/core/cipher/fail';
import { range, rank } from '@/core/cipher/make/rank';
import { alphaRatio, mapAlpha, mod } from '@/core/text/alpha';
import type { Args } from '@/core/cipher/types';

const COPRIME = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

const keys = (a: Args) => {
  const k = mod(int(a, 'a', 1), 26);
  if (!COPRIME.includes(k)) throw new Fail(`a must be coprime with 26: ${COPRIME.join(', ')}`);
  return { k, b: int(a, 'b'), inv: range(1, 25).find((x) => (k * x) % 26 === 1) ?? 1 };
};

const run = (s: string, a: Args) => {
  const { b, inv } = keys(a);
  return mapAlpha(s, (i) => inv * (i - b));
};

export const affine = define({
  id: 'affine',
  name: 'Affine',
  group: 'classic',
  info: 'Each letter x becomes a·x + b (mod 26). a must be coprime with 26.',
  params: [
    { id: 'a', label: 'a', kind: 'int', min: 1, max: 25, def: 5 },
    { id: 'b', label: 'b', kind: 'int', min: 0, max: 25, def: 8 },
  ],
  fits: (s) => alphaRatio(s) >= 0.6,
  decode: run,
  encode: (s, a) => {
    const { k, b } = keys(a);
    return mapAlpha(s, (i) => k * i + b);
  },
  crack: (s) =>
    rank(
      s,
      COPRIME.flatMap((a) => range(0, 25).map((b) => ({ a, b }))).filter((x) => x.a !== 1 || x.b !== 0),
      run,
      10,
    ),
});
