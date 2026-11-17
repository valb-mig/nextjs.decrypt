import { define } from '@/core/cipher/make/define';
import { Fail } from '@/core/cipher/fail';
import { fromBytes, toBytes } from '@/core/text/bytes';

const A = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export const base58 = define({
  id: 'base58',
  name: 'Base58',
  group: 'encoding',
  info: 'Bitcoin alphabet: no 0, O, I or l, so it survives being read aloud.',
  fits: (s) => {
    const t = s.trim();
    return t.length >= 6 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(t) && /\d/.test(t) && /[a-z]/i.test(t);
  },
  decode: (s) => {
    const t = s.trim();
    let n = 0n;
    for (const c of t) {
      const i = A.indexOf(c);
      if (i < 0) throw new Fail(`Invalid Base58 symbol "${c}"`);
      n = n * 58n + BigInt(i);
    }
    const out: number[] = [];
    while (n > 0n) {
      out.unshift(Number(n % 256n));
      n /= 256n;
    }
    const lead = t.match(/^1*/)?.[0].length ?? 0;
    return fromBytes(Uint8Array.from([...new Array(lead).fill(0), ...out]));
  },
  encode: (s) => {
    const b = toBytes(s);
    let n = b.reduce((acc, x) => acc * 256n + BigInt(x), 0n);
    let out = '';
    while (n > 0n) {
      out = A[Number(n % 58n)] + out;
      n /= 58n;
    }
    const lead = b.findIndex((x) => x !== 0);
    return '1'.repeat(lead < 0 ? b.length : lead) + out;
  },
});
