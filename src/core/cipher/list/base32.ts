import { define } from '@/core/cipher/make/define';
import { Fail } from '@/core/cipher/fail';
import { fromBytes, toBytes } from '@/core/text/bytes';

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export const base32 = define({
  id: 'base32',
  name: 'Base32',
  group: 'encoding',
  info: 'RFC 4648 encoding with A–Z and 2–7, padded with =.',
  fits: (s) => {
    const t = s.replace(/\s/g, '');
    return t.length >= 8 && /^[A-Z2-7]+=*$/.test(t) && /[2-7]/.test(t);
  },
  decode: (s) => {
    const t = s.toUpperCase().replace(/[\s=]/g, '');
    if (!/^[A-Z2-7]*$/.test(t)) throw new Fail('Invalid Base32');
    const out: number[] = [];
    let val = 0;
    let bits = 0;
    for (const c of t) {
      val = (val << 5) | A.indexOf(c);
      bits += 5;
      if (bits >= 8) {
        bits -= 8;
        out.push((val >>> bits) & 255);
        val &= (1 << bits) - 1;
      }
    }
    return fromBytes(Uint8Array.from(out));
  },
  encode: (s) => {
    let out = '';
    let val = 0;
    let bits = 0;
    for (const b of toBytes(s)) {
      val = (val << 8) | b;
      bits += 8;
      while (bits >= 5) {
        bits -= 5;
        out += A[(val >>> bits) & 31];
        val &= (1 << bits) - 1;
      }
    }
    if (bits) out += A[(val << (5 - bits)) & 31];
    return out.padEnd(Math.ceil(out.length / 8) * 8, '=');
  },
});
