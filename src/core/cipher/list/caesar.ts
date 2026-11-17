import { define, int } from '@/core/cipher/make/define';
import { range, rank } from '@/core/cipher/make/rank';
import { alphaRatio, mapAlpha } from '@/core/text/alpha';
import type { Args } from '@/core/cipher/types';

const run = (s: string, a: Args) => mapAlpha(s, (i) => i - int(a, 'shift'));

export const caesar = define({
  id: 'caesar',
  name: 'Caesar / ROT',
  group: 'classic',
  info: 'Shifts every letter by a fixed amount. ROT13 is a shift of 13.',
  params: [{ id: 'shift', label: 'Shift', kind: 'int', min: 1, max: 25, def: 13 }],
  fits: (s) => alphaRatio(s) >= 0.6,
  decode: run,
  encode: (s, a) => mapAlpha(s, (i) => i + int(a, 'shift')),
  crack: (s) => rank(s, range(1, 25).map((shift) => ({ shift })), run, 25),
});
