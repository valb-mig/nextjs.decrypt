const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

const leet = (w: string) =>
  w.replace(/[aeiost]/gi, (c) => ({ a: '4', e: '3', i: '1', o: '0', s: '5', t: '7' })[c.toLowerCase()] ?? c);

const tails = ['1', '12', '123', '1234', '!', '@', '2024', '2025', '2026'];

export const mutate = (w: string) => {
  const base = [w, cap(w), w.toUpperCase(), leet(w), Array.from(w).reverse().join('')];
  return [...new Set([...base, ...tails.flatMap((t) => [w + t, cap(w) + t])])];
};
