import { describe, expect, it } from 'vitest';
import { crack, digest, identify } from '@/core/hash';

describe('digest', () => {
  it('md5', async () => {
    expect(await digest('md5', '')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    expect(await digest('md5', 'password')).toBe('5f4dcc3b5aa765d61d8327deb882cf99');
    expect(await digest('md5', 'a'.repeat(100))).toBe('36a92cc94a9e0fa21f625f8bfb007adf');
  });
  it('md4', async () => {
    expect(await digest('md4', '')).toBe('31d6cfe0d16ae931b73c59d7e0c089c0');
    expect(await digest('md4', 'abc')).toBe('a448017aaf21d8525fc10ae87aa6729d');
  });
  it('ntlm', async () => expect(await digest('ntlm', 'password')).toBe('8846f7eaee8fb117ad06bdd830b7586c'));
  it('sha256', async () =>
    expect(await digest('sha256', 'abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'));
});

describe('identify', () => {
  it('md5 family', () => expect(identify('5f4dcc3b5aa765d61d8327deb882cf99').map((k) => k.id)).toContain('md5'));
  it('bcrypt', () =>
    expect(identify('$2b$12$KIXQJ2ZrTj6hS0x7Yq5bGe3vM0X9QfEYF7zWz0b1qk0n8b8r6x5aW')[0]?.id).toBe('bcrypt'));
});

describe('crack', () => {
  it('finds sha1 with mutation', async () => {
    const hash = await digest('sha1', 'Dragon123');
    const hit = await crack(hash, { words: ['monkey', 'dragon'], algos: ['md5', 'sha1'], deep: true });
    expect(hit).toEqual({ word: 'Dragon123', algo: 'sha1' });
  });
});
