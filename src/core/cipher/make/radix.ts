import { define } from '@/core/cipher/make/define';
import { Fail } from '@/core/cipher/fail';
import { fromBytes, toBytes } from '@/core/text/bytes';
import { chars } from '@/core/text/alpha';

type Opts = {
  id: string;
  name: string;
  info: string;
  base: number;
  width: number;
  unit: 'byte' | 'code';
  fits: (s: string) => boolean;
  strip?: RegExp;
};

const split = (s: string, width: number) => {
  const toks = s.split(/[\s,;:|]+/).filter(Boolean);
  if (toks.length > 1) return toks;
  const one = toks[0] ?? '';
  if (one.length % width) throw new Fail(`Expected groups of ${width} digits`);
  return one.match(new RegExp(`.{${width}}`, 'g')) ?? [];
};

export const radix = ({ base, width, unit, fits, strip, ...meta }: Opts) =>
  define({
    ...meta,
    group: 'encoding',
    fits: (s) => fits(s.trim()),
    decode: (s) => {
      const clean = strip ? s.replace(strip, ' ') : s;
      const nums = split(clean.trim(), width).map((t) => {
        const v = parseInt(t, base);
        if (Number.isNaN(v) || !new RegExp(`^[0-9a-z]+$`, 'i').test(t)) throw new Fail(`Invalid token "${t}"`);
        return v;
      });
      if (unit === 'code') {
        if (nums.some((v) => v > 0x10ffff)) throw new Fail('Code point out of range');
        return String.fromCodePoint(...nums);
      }
      if (nums.some((v) => v > 255)) throw new Fail('Byte out of range');
      return fromBytes(Uint8Array.from(nums));
    },
    encode: (s) =>
      (unit === 'code' ? chars(s).map((c) => c.codePointAt(0) ?? 0) : Array.from(toBytes(s)))
        .map((v) => v.toString(base).padStart(width, '0'))
        .join(' '),
  });
