import { describe, expect, it } from 'vitest';
import { ciphers, defaults, find } from '@/core/cipher';

const text = 'Hello, World! Meet me at dawn.';

describe('round trip', () => {
  for (const c of ciphers) {
    it(c.id, () => {
      const a = defaults(c.params);
      const src = c.group === 'code' ? 'meet me at dawn' : text;
      const back = c.decode(c.encode(src, a), a);
      expect(c.group === 'code' ? back : back).toBe(c.id === 'polybius' ? 'meet me at dawn' : src);
    });
  }
});

describe('known vectors', () => {
  const dec = (id: string, s: string, a = {}) => find(id)!.decode(s, a);
  it('binary', () => expect(dec('binary', '01001000 01101001')).toBe('Hi'));
  it('binary packed', () => expect(dec('binary', '0100100001101001')).toBe('Hi'));
  it('binary utf8', () => expect(dec('binary', '11000011 10100111')).toBe('ç'));
  it('hex', () => expect(dec('hex', '0x48 0x69')).toBe('Hi'));
  it('base64', () => expect(dec('base64', 'aGVsbG8gd29ybGQ=')).toBe('hello world'));
  it('base64 unpadded', () => expect(dec('base64', 'aGVsbG8gd29ybGQ')).toBe('hello world'));
  it('base32', () => expect(dec('base32', 'NBSWY3DP')).toBe('hello'));
  it('base58', () => expect(dec('base58', 'Cn8eVZg')).toBe('hello'));
  it('morse', () => expect(dec('morse', '.... . .-.. .-.. --- / .-- --- .-. .-.. -..')).toBe('hello world'));
  it('a1z26', () => expect(dec('a1z26', '8-5-12-12-15 23-15-18-12-4')).toBe('hello world'));
  it('rot13', () => expect(dec('caesar', 'Uryyb', { shift: 13 })).toBe('Hello'));
  it('rot47', () => expect(dec('rot47', 'w6==@')).toBe('Hello'));
  it('atbash', () => expect(dec('atbash', 'Svool')).toBe('Hello'));
  it('vigenere', () => expect(dec('vigenere', 'LXFOPVEFRNHR', { key: 'LEMON' })).toBe('ATTACKATDAWN'));
  it('railfence', () => expect(dec('railfence', 'WECRLTEERDSOEEFEAOCAIVDEN', { rails: 3 })).toBe('WEAREDISCOVEREDFLEEATONCE'));
  it('affine', () => expect(dec('affine', 'IHHWVCSWFRCP', { a: 5, b: 8 })).toBe('AFFINECIPHER'));
});

describe('crack', () => {
  const plain = 'the quick brown fox jumps over the lazy dog while the secret message hides in plain sight';
  it('caesar', () => {
    const c = find('caesar')!;
    expect(c.crack!(c.encode(plain, { shift: 7 }))[0].args.shift).toBe(7);
  });
  it('affine', () => {
    const c = find('affine')!;
    expect(c.crack!(c.encode(plain, { a: 7, b: 3 }))[0].text).toBe(plain);
  });
  it('vigenere', () => {
    const c = find('vigenere')!;
    const long = `${plain} and nobody will ever find out where the treasure was buried by the old pirate captain`;
    expect(c.crack!(c.encode(long, { key: 'PIXEL' }))[0].args.key).toBe('PIXEL');
  });
  it('railfence', () => {
    const c = find('railfence')!;
    expect(c.crack!(c.encode(plain, { rails: 4 }))[0].args.rails).toBe(4);
  });
});
