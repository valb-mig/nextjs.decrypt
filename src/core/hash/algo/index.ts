import { md4 } from '@/core/hash/algo/md4';
import { md5 } from '@/core/hash/algo/md5';
import { toBytes, toHex } from '@/core/text/bytes';

export type Algo = 'md5' | 'md4' | 'ntlm' | 'sha1' | 'sha256' | 'sha384' | 'sha512';

type Run = (b: Uint8Array) => Uint8Array | Promise<Uint8Array>;

const web = (name: string): Run => async (b) =>
  new Uint8Array(await crypto.subtle.digest(name, b as Uint8Array<ArrayBuffer>));

const utf16 = (s: string) => {
  const b = new Uint8Array(s.length * 2);
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    b[i * 2] = c & 255;
    b[i * 2 + 1] = c >> 8;
  }
  return b;
};

export const algos: Record<Algo, { name: string; run: (s: string) => Uint8Array | Promise<Uint8Array> }> = {
  md5: { name: 'MD5', run: (s) => md5(toBytes(s)) },
  md4: { name: 'MD4', run: (s) => md4(toBytes(s)) },
  ntlm: { name: 'NTLM', run: (s) => md4(utf16(s)) },
  sha1: { name: 'SHA-1', run: (s) => web('SHA-1')(toBytes(s)) },
  sha256: { name: 'SHA-256', run: (s) => web('SHA-256')(toBytes(s)) },
  sha384: { name: 'SHA-384', run: (s) => web('SHA-384')(toBytes(s)) },
  sha512: { name: 'SHA-512', run: (s) => web('SHA-512')(toBytes(s)) },
};

export const digest = async (algo: Algo, s: string) => toHex(await algos[algo].run(s));
