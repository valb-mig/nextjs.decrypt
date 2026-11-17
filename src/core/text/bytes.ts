const enc = new TextEncoder();
const utf8 = new TextDecoder('utf-8', { fatal: true });

export const toBytes = (s: string) => enc.encode(s);

export const latin = (b: Uint8Array) => Array.from(b, (x) => String.fromCharCode(x)).join('');

export const fromBytes = (b: Uint8Array) => {
  try {
    return utf8.decode(b);
  } catch {
    return latin(b);
  }
};

export const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
