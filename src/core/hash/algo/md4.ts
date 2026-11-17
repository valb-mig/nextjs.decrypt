import { out, pad, rotl, words } from '@/core/hash/algo/pad';

type Fn = (x: number, y: number, z: number) => number;

const F: Fn = (x, y, z) => (x & y) | (~x & z);
const G: Fn = (x, y, z) => (x & y) | (x & z) | (y & z);
const H: Fn = (x, y, z) => x ^ y ^ z;

const rounds: { f: Fn; add: number; s: number[]; k: number[] }[] = [
  { f: F, add: 0, s: [3, 7, 11, 19], k: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
  { f: G, add: 0x5a827999, s: [3, 5, 9, 13], k: [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15] },
  { f: H, add: 0x6ed9eba1, s: [3, 9, 11, 15], k: [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15] },
];

export const md4 = (b: Uint8Array) => {
  const dv = pad(b);
  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  for (let o = 0; o < dv.byteLength; o += 64) {
    const m = words(dv, o);
    const v = [...h];
    for (const { f, add, s, k } of rounds) {
      for (let i = 0; i < 16; i++) {
        const t = (4 - (i % 4)) % 4;
        const x = f(v[(t + 1) % 4], v[(t + 2) % 4], v[(t + 3) % 4]);
        v[t] = rotl((v[t] + x + m[k[i]] + add) >>> 0, s[i % 4]);
      }
    }
    v.forEach((x, i) => (h[i] = (h[i] + x) >>> 0));
  }
  return out(h);
};
