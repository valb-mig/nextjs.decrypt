import { out, pad, rotl, words } from '@/core/hash/algo/pad';

const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);

export const md5 = (b: Uint8Array) => {
  const dv = pad(b);
  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  for (let o = 0; o < dv.byteLength; o += 64) {
    const m = words(dv, o);
    let [A, B, C, D] = h;
    for (let i = 0; i < 64; i++) {
      const r = i >> 4;
      const f = r === 0 ? (B & C) | (~B & D) : r === 1 ? (D & B) | (~D & C) : r === 2 ? B ^ C ^ D : C ^ (B | ~D);
      const g = r === 0 ? i : r === 1 ? (5 * i + 1) % 16 : r === 2 ? (3 * i + 5) % 16 : (7 * i) % 16;
      const t = (f + A + K[i] + m[g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(t, S[r * 4 + (i % 4)])) >>> 0;
    }
    h[0] = (h[0] + A) >>> 0;
    h[1] = (h[1] + B) >>> 0;
    h[2] = (h[2] + C) >>> 0;
    h[3] = (h[3] + D) >>> 0;
  }
  return out(h);
};
