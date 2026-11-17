import { solve } from '@/core/solve';

type Ask = { id: number; text: string };

const ctx = self as unknown as { onmessage: (e: MessageEvent<Ask>) => void; postMessage: (m: unknown) => void };

ctx.onmessage = (e) => {
  const { id, text } = e.data;
  ctx.postMessage({ id, hits: solve(text) });
};
