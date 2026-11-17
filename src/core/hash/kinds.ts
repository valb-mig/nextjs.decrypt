import type { Algo } from '@/core/hash/algo';

export type Kind = { id: string; name: string; algo?: Algo; test: RegExp; note?: string };

const hex = (n: number) => new RegExp(`^[a-f0-9]{${n}}$`, 'i');

export const kinds: Kind[] = [
  { id: 'md5', name: 'MD5', algo: 'md5', test: hex(32) },
  { id: 'ntlm', name: 'NTLM', algo: 'ntlm', test: hex(32), note: 'Windows password hash' },
  { id: 'md4', name: 'MD4', algo: 'md4', test: hex(32) },
  { id: 'sha1', name: 'SHA-1', algo: 'sha1', test: hex(40) },
  { id: 'ripemd160', name: 'RIPEMD-160', test: hex(40) },
  { id: 'sha224', name: 'SHA-224', test: hex(56) },
  { id: 'sha256', name: 'SHA-256', algo: 'sha256', test: hex(64) },
  { id: 'sha3-256', name: 'SHA3-256 / Keccak', test: hex(64) },
  { id: 'sha384', name: 'SHA-384', algo: 'sha384', test: hex(96) },
  { id: 'sha512', name: 'SHA-512', algo: 'sha512', test: hex(128) },
  { id: 'whirlpool', name: 'Whirlpool', test: hex(128) },
  { id: 'crc32', name: 'CRC32', test: hex(8), note: 'Checksum, not a password hash' },
  { id: 'mysql323', name: 'MySQL 3.23', test: hex(16) },
  { id: 'mysql5', name: 'MySQL 5', test: /^\*[A-F0-9]{40}$/i },
  { id: 'bcrypt', name: 'bcrypt', test: /^\$2[abxy]?\$\d{2}\$[./A-Za-z0-9]{53}$/, note: 'Slow by design, salted' },
  { id: 'md5crypt', name: 'MD5-Crypt', test: /^\$1\$[^$]{0,8}\$[./A-Za-z0-9]{22}$/, note: 'Unix crypt, salted' },
  { id: 'apr1', name: 'Apache APR1', test: /^\$apr1\$[^$]{0,8}\$[./A-Za-z0-9]{22}$/ },
  { id: 'sha256crypt', name: 'SHA256-Crypt', test: /^\$5\$(rounds=\d+\$)?[^$]{0,16}\$[./A-Za-z0-9]{43}$/ },
  { id: 'sha512crypt', name: 'SHA512-Crypt', test: /^\$6\$(rounds=\d+\$)?[^$]{0,16}\$[./A-Za-z0-9]{86}$/ },
  { id: 'argon2', name: 'Argon2', test: /^\$argon2(id|i|d)\$/, note: 'Memory-hard, salted' },
  { id: 'phpass', name: 'phpass (WordPress)', test: /^\$[PH]\$[./A-Za-z0-9]{31}$/ },
  { id: 'pbkdf2', name: 'Django PBKDF2', test: /^pbkdf2_sha256\$\d+\$/ },
];

export const identify = (src: string) => {
  const t = src.trim();
  return t ? kinds.filter((k) => k.test.test(t)) : [];
};
