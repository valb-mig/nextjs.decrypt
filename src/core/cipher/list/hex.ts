import { radix } from '@/core/cipher/make/radix';

const strip = /0x|\\x|[-:]/gi;

export const hex = radix({
  id: 'hex',
  name: 'Hexadecimal',
  info: 'Bytes written in base 16. Accepts 0x, \\x, colons and spaces.',
  base: 16,
  width: 2,
  unit: 'byte',
  strip,
  fits: (s) => {
    const t = s.replace(strip, '').replace(/\s/g, '');
    return t.length >= 4 && t.length % 2 === 0 && /^[0-9a-f]+$/i.test(t);
  },
});
