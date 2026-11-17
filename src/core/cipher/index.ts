import { a1z26 } from '@/core/cipher/list/a1z26';
import { affine } from '@/core/cipher/list/affine';
import { atbash } from '@/core/cipher/list/atbash';
import { bacon } from '@/core/cipher/list/bacon';
import { base32 } from '@/core/cipher/list/base32';
import { base58 } from '@/core/cipher/list/base58';
import { base64 } from '@/core/cipher/list/base64';
import { binary } from '@/core/cipher/list/binary';
import { caesar } from '@/core/cipher/list/caesar';
import { decimal } from '@/core/cipher/list/decimal';
import { hex } from '@/core/cipher/list/hex';
import { morse } from '@/core/cipher/list/morse';
import { octal } from '@/core/cipher/list/octal';
import { polybius } from '@/core/cipher/list/polybius';
import { railfence } from '@/core/cipher/list/railfence';
import { reverse } from '@/core/cipher/list/reverse';
import { rot47 } from '@/core/cipher/list/rot47';
import { url } from '@/core/cipher/list/url';
import { vigenere } from '@/core/cipher/list/vigenere';
import type { Cipher, Group } from '@/core/cipher/types';

export const ciphers: Cipher[] = [
  binary,
  octal,
  decimal,
  hex,
  base32,
  base58,
  base64,
  url,
  morse,
  a1z26,
  bacon,
  polybius,
  caesar,
  rot47,
  atbash,
  affine,
  vigenere,
  railfence,
  reverse,
];

export const groups: Record<Group, string> = {
  encoding: 'Encodings',
  code: 'Codes',
  classic: 'Ciphers',
  transposition: 'Transposition',
};

export const find = (id: string) => ciphers.find((c) => c.id === id);

export { defaults } from '@/core/cipher/make/define';
export { Fail } from '@/core/cipher/fail';
export type { Args, Cipher, Group, Guess, Param } from '@/core/cipher/types';
