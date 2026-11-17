import type { Args, Cipher, Param } from '@/core/cipher/types';

type Spec = Omit<Cipher, 'params' | 'fits'> & Partial<Pick<Cipher, 'params' | 'fits'>>;

export const define = (s: Spec): Cipher => ({ params: [], fits: () => true, ...s });

export const defaults = (params: Param[]): Args =>
  Object.fromEntries(params.map((p) => [p.id, p.def]));

export const int = (args: Args, id: string, def = 0) => {
  const v = Number(args[id]);
  return Number.isFinite(v) ? Math.trunc(v) : def;
};

export const str = (args: Args, id: string, def = '') => String(args[id] ?? def);
