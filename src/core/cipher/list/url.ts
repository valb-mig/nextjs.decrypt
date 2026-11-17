import { define } from '@/core/cipher/make/define';
import { Fail } from '@/core/cipher/fail';

export const url = define({
  id: 'url',
  name: 'URL encoding',
  group: 'encoding',
  info: 'Percent-encoding used in links: %20 is a space, %3F a question mark.',
  fits: (s) => /%[0-9a-f]{2}/i.test(s),
  decode: (s) => {
    try {
      return decodeURIComponent(s.replace(/\+/g, ' '));
    } catch {
      throw new Fail('Broken percent sequence');
    }
  },
  encode: (s) => encodeURIComponent(s),
});
