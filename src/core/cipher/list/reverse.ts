import { define } from '@/core/cipher/make/define';
import { chars } from '@/core/text/alpha';

const run = (s: string) => chars(s).reverse().join('');

export const reverse = define({
  id: 'reverse',
  name: 'Reverse',
  group: 'transposition',
  info: 'Reads the text backwards.',
  fits: (s) => s.trim().length >= 3,
  decode: run,
  encode: run,
});
