export const mod = (x: number, m: number) => ((x % m) + m) % m;

export const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

export const letters = (s: string) => plain(s).toUpperCase().replace(/[^A-Z]/g, '');

export const alphaRatio = (s: string) => {
  const t = s.replace(/\s/g, '');
  return t.length ? letters(t).length / t.length : 0;
};

export const mapAlpha = (s: string, fn: (i: number, n: number) => number) => {
  let n = 0;
  return s.replace(/[a-z]/gi, (c) => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(base + mod(fn(c.charCodeAt(0) - base, n++), 26));
  });
};

export const chars = (s: string) => Array.from(s);
