import { define } from '@/core/cipher/make/define';

const run = (s: string) =>
  s.replace(/[!-~]/g, (c) => String.fromCharCode(33 + ((c.charCodeAt(0) - 33 + 47) % 94)));

export const rot47 = define({
  id: 'rot47',
  name: 'ROT47',
  group: 'classic',
  info: 'Rotates every printable ASCII symbol by 47, so digits and punctuation change too.',
  fits: (s) => /^[\x20-\x7e\s]+$/.test(s) && /[!-~]/.test(s),
  decode: run,
  encode: run,
});
