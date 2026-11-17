import { algos, type Algo } from '@/core/hash/algo';
import { mutate } from '@/core/hash/mutate';
import { toHex } from '@/core/text/bytes';

export type Found = { word: string; algo: Algo };

type Opts = {
  words: string[];
  algos: Algo[];
  deep?: boolean;
  signal?: AbortSignal;
  tick?: (done: number, total: number) => void;
};

const BATCH = 250;

const rest = () => new Promise((r) => setTimeout(r, 0));

export const crack = async (hash: string, o: Opts): Promise<Found | null> => {
  const target = hash.trim().toLowerCase();
  const list = [...new Set(o.words.map((w) => w.trim()).filter(Boolean))];
  const total = list.length;
  for (let i = 0; i < total; i++) {
    if (o.signal?.aborted) return null;
    const tries = o.deep ? mutate(list[i]) : [list[i]];
    for (const word of tries) {
      for (const algo of o.algos) {
        if (toHex(await algos[algo].run(word)) === target) return { word, algo };
      }
    }
    if (i % BATCH === BATCH - 1) {
      o.tick?.(i + 1, total);
      await rest();
    }
  }
  o.tick?.(total, total);
  return null;
};
