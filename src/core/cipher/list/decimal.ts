import { radix } from '@/core/cipher/make/radix';

export const decimal = radix({
  id: 'decimal',
  name: 'Decimal',
  info: 'Character codes in base 10 (ASCII / Unicode), separated by spaces or commas.',
  base: 10,
  width: 3,
  unit: 'code',
  fits: (s) => /^\d{1,7}([\s,;]+\d{1,7})+$/.test(s) && /\d{2}/.test(s),
});
