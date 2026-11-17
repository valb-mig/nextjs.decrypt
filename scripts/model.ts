import { readFileSync, writeFileSync } from 'node:fs';

const SYM = 27;
const Q = 4;
const MAX = 63;
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

const read = (path: string) => {
  const raw = readFileSync(path);
  let s: string;
  try {
    s = new TextDecoder('utf-8', { fatal: true }).decode(raw);
  } catch {
    s = new TextDecoder('latin1').decode(raw);
  }
  const start = s.search(/\*\*\* ?START OF/i);
  const end = s.search(/\*\*\* ?END OF/i);
  return s.slice(start < 0 ? 0 : s.indexOf('\n', start), end < 0 ? s.length : end);
};

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]+/g, ' ')
    .trim();

const code = (c: string) => (c === ' ' ? 0 : c.charCodeAt(0) - 96);

const train = (text: string) => {
  const n = new Float64Array(SYM ** 3);
  const t = ` ${text} `;
  for (let i = 2; i < t.length; i++) n[(code(t[i - 2]) * SYM + code(t[i - 1])) * SYM + code(t[i])]++;
  const q = new Uint8Array(SYM ** 3);
  for (let ctx = 0; ctx < SYM * SYM; ctx++) {
    let sum = 0;
    for (let z = 0; z < SYM; z++) sum += n[ctx * SYM + z];
    for (let z = 0; z < SYM; z++) {
      const p = (n[ctx * SYM + z] + 0.5) / (sum + SYM * 0.5);
      q[ctx * SYM + z] = Math.min(MAX, Math.round(-Math.log2(p) * Q));
    }
  }
  return q;
};

const bits = (q: Uint8Array, text: string) => {
  const t = ` ${text} `;
  let sum = 0;
  for (let i = 2; i < t.length; i++) sum += q[(code(t[i - 2]) * SYM + code(t[i - 1])) * SYM + code(t[i])] / Q;
  return sum / Math.max(1, t.length - 2);
};

const noise = (len: number, gap: boolean) => {
  let s = '';
  while (s.length < len) {
    s += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    if (gap && Math.random() < 0.18) s += ' ';
  }
  return s.trim();
};

const build = (paths: string[]) => {
  const text = norm(paths.map(read).join(' '));
  const cut = Math.floor(text.length * 0.9);
  const q = train(text.slice(0, cut));
  const held = text.slice(cut);
  const solid = held.replace(/ /g, '');
  return {
    tri: Array.from(q, (x) => B64[x]).join(''),
    lang: [bits(q, held), bits(q, solid)].map((x) => +x.toFixed(3)),
    rand: [bits(q, noise(200000, true)), bits(q, noise(200000, false))].map((x) => +x.toFixed(3)),
    size: text.length,
  };
};

const args = process.argv.slice(2);
const out = args.shift() ?? '';
const groups: Record<string, string[]> = {};
let cur = '';
for (const a of args) {
  if (a.startsWith('--')) groups[(cur = a.slice(2))] = [];
  else groups[cur].push(a);
}

const models = Object.entries(groups).map(([id, paths]) => ({ id, ...build(paths) }));
for (const m of models) console.log(m.id, m.size, 'lang', m.lang, 'rand', m.rand);

const body = models
  .map((m) => `  { id: '${m.id}', lang: [${m.lang.join(', ')}], rand: [${m.rand.join(', ')}], tri: '${m.tri}' },`)
  .join('\n');

writeFileSync(
  out,
  `export type Model = { id: string; lang: number[]; rand: number[]; tri: string };\n\nexport const SYM = ${SYM};\nexport const Q = ${Q};\nexport const B64 = '${B64}';\n\nexport const models: Model[] = [\n${body}\n];\n`,
);
