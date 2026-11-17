export const pad = (b: Uint8Array) => {
  const n = (((b.length + 8) >> 6) + 1) * 64;
  const out = new Uint8Array(n);
  out.set(b);
  out[b.length] = 0x80;
  const dv = new DataView(out.buffer);
  dv.setUint32(n - 8, (b.length * 8) >>> 0, true);
  dv.setUint32(n - 4, Math.floor(b.length / 0x20000000), true);
  return dv;
};

export const rotl = (x: number, c: number) => ((x << c) | (x >>> (32 - c))) >>> 0;

export const words = (dv: DataView, o: number) => Array.from({ length: 16 }, (_, i) => dv.getUint32(o + i * 4, true));

export const out = (h: number[]) => {
  const dv = new DataView(new ArrayBuffer(h.length * 4));
  h.forEach((x, i) => dv.setUint32(i * 4, x, true));
  return new Uint8Array(dv.buffer);
};
