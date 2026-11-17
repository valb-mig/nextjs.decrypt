import { describe, expect, it } from 'vitest';
import { rate } from '@/core/score';
import { solve, wrap } from '@/core/solve';
import { samples } from '@/ui/views/auto/samples';

type Chain = [string, Record<string, string | number>?][];

const lines = [
  'programming languages evolve slowly over decades',
  'a raposa marrom pula sobre o cachorro preguicoso',
  'the wizard lives beyond the frozen mountains',
  'cuidado com o cofre atras do quadro na sala',
  'curiosity killed the cat but satisfaction brought it back',
  'Pixel art is a form of digital art',
  'Os dados estao guardados no servidor antigo',
  'winter is coming',
];

const chains: Chain[] = [
  [['base64']],
  [['hex']],
  [['binary']],
  [['caesar', { shift: 3 }]],
  [['caesar', { shift: 11 }], ['base64']],
  [['atbash']],
  [['reverse']],
  [['rot47'], ['base64']],
  [['base32'], ['hex']],
  [['railfence', { rails: 3 }]],
  [['affine', { a: 7, b: 2 }]],
  [['url']],
  [['octal']],
  [['base58']],
  [['decimal'], ['base64']],
  [['reverse'], ['hex'], ['base64']],
];

describe('corpus', () => {
  it('solves at least 95% of chained puzzles', { timeout: 60000 }, () => {
    let ok = 0;
    for (const l of lines) for (const c of chains) if (solve(wrap(l, c))[0]?.text === l) ok++;
    expect(ok / (lines.length * chains.length)).toBeGreaterThanOrEqual(0.95);
  });

  it('rejects noise', () => {
    for (const g of ['Xk9fQ2mZ7pL0vB', 'kjhsdf8723hjkd', 'asdkjh qweoiu zxcmnb']) expect(rate(g)).toBeLessThan(0.3);
  });

  for (const x of samples) {
    it(`sample ${x.label}`, () => expect(solve(x.text)[0]?.score).toBeGreaterThan(0.6));
  }
});
