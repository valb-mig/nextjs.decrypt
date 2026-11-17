import { define } from '@/core/cipher/make/define';
import { alphaRatio, mapAlpha } from '@/core/text/alpha';

const run = (s: string) => mapAlpha(s, (i) => 25 - i);

export const atbash = define({
  id: 'atbash',
  name: 'Atbash',
  group: 'classic',
  info: 'Mirrors the alphabet: A↔Z, B↔Y, C↔X.',
  fits: (s) => alphaRatio(s) >= 0.6,
  decode: run,
  encode: run,
});
