import { radix } from '@/core/cipher/make/radix';

export const binary = radix({
  id: 'binary',
  name: 'Binary',
  info: 'Bytes written in base 2, eight bits per byte. Spaces between bytes are optional.',
  base: 2,
  width: 8,
  unit: 'byte',
  fits: (s) => /^[01]{7,8}(\s+[01]{7,8})*$/.test(s) || (/^[01]+$/.test(s) && s.length % 8 === 0),
});
