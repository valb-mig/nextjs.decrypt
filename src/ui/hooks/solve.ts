import { useEffect, useRef, useState } from 'react';
import { solve, type Hit } from '@/core/solve';
import { useDebounced } from '@/ui/hooks/debounce';

type State = { hits: Hit[]; busy: boolean; ms: number; done: string };

const idle: State = { hits: [], busy: false, ms: 0, done: '' };

export const useSolve = (text: string) => {
  const [state, setState] = useState<State>(idle);
  const worker = useRef<Worker | null>(null);
  const seq = useRef(0);
  const q = useDebounced(text, 250);

  useEffect(() => {
    try {
      worker.current = new Worker(new URL('../work/solve.ts', import.meta.url), { type: 'module' });
    } catch {
      worker.current = null;
    }
    return () => worker.current?.terminate();
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setState(idle);
      return;
    }
    const id = ++seq.current;
    const t0 = performance.now();
    const finish = (hits: Hit[]) => setState({ hits, busy: false, ms: performance.now() - t0, done: q });
    setState((s) => ({ ...s, busy: true }));
    const w = worker.current;
    if (!w) {
      finish(solve(q));
      return;
    }
    w.onmessage = (e: MessageEvent<{ id: number; hits: Hit[] }>) => {
      if (e.data.id === id) finish(e.data.hits);
    };
    w.postMessage({ id, text: q });
  }, [q]);

  return { ...state, stale: state.busy || q !== text };
};
