import { wrap } from '@/core/solve';

export type Sample = { label: string; text: string };

export const samples: Sample[] = [
  { label: 'Binary', text: wrap('hello world', [['binary']]) },
  { label: 'ROT13', text: wrap('the treasure is buried under the old oak tree', [['caesar', { shift: 13 }]]) },
  { label: 'Morse', text: wrap('meet me at midnight', [['morse']]) },
  { label: 'Base64 › Hex', text: wrap('decrypt peels every layer', [['hex'], ['base64']]) },
  {
    label: 'Vigenère',
    text: wrap(
      'a long time ago in a galaxy far far away the rebels hid the stolen plans inside a little droid',
      [['vigenere', { key: 'PIXEL' }]],
    ),
  },
  { label: 'Mystery', text: wrap('voce encontrou a chave escondida', [['caesar', { shift: 7 }], ['hex'], ['base64']]) },
];
