import { radix } from '@/core/cipher/make/radix';

export const octal = radix({
  id: 'octal',
  name: 'Octal',
  info: 'Bytes written in base 8, three digits per byte.',
  base: 8,
  width: 3,
  unit: 'byte',
  fits: (s) => /^[0-7]{2,3}(\s+[0-7]{2,3})+$/.test(s),
});
