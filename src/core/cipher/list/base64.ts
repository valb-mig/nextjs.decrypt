import { define } from '@/core/cipher/make/define';
import { Fail } from '@/core/cipher/fail';
import { fromBytes, latin, toBytes } from '@/core/text/bytes';

const clean = (s: string) => s.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');

export const base64 = define({
  id: 'base64',
  name: 'Base64',
  group: 'encoding',
  info: 'Binary-to-text encoding with 64 symbols. URL-safe and unpadded input also work.',
  fits: (s) => {
    const t = s.replace(/\s/g, '');
    return t.length >= 4 && t.length % 4 !== 1 && /^[A-Za-z0-9+/_-]+={0,2}$/.test(t);
  },
  decode: (s) => {
    const t = clean(s);
    if (!/^[A-Za-z0-9+/]*$/.test(t) || t.length % 4 === 1) throw new Fail('Invalid Base64');
    const bin = atob(t + '='.repeat((4 - (t.length % 4)) % 4));
    return fromBytes(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  },
  encode: (s) => btoa(latin(toBytes(s))),
});
