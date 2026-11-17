import { describe, expect, it } from 'vitest';
import { solve, wrap } from '@/core/solve';

const cases: [string, [string, Record<string, string | number>?][]][] = [
  ['hello world', [['binary']]],
  ['meet me at the old bridge', [['hex'], ['base64']]],
  ['the password is pixel', [['caesar', { shift: 13 }]]],
  ['o tesouro esta escondido na casa velha', [['caesar', { shift: 5 }], ['base64']]],
  ['attack at dawn', [['morse']]],
  ['find the hidden flag', [['reverse'], ['base32']]],
  ['secret message', [['atbash'], ['hex'], ['base64']]],
  ['hello there friend', [['a1z26']]],
  ['the treasure is under the tree', [['rot47']]],
  ['you found the answer', [['url']]],
  ['hello world', [['base58']]],
];

describe('solve', () => {
  for (const [plain, steps] of cases) {
    it(steps.map(([id]) => id).join(' > '), () => {
      const hits = solve(wrap(plain, steps));
      expect(hits[0]?.text.toLowerCase()).toBe(plain);
    });
  }
});
