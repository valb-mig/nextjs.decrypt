import { useCallback, useEffect, useState } from 'react';

export const useRoute = <T extends string>(ids: readonly T[], fallback: T) => {
  const [route, setRoute] = useState<T>(fallback);

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1) as T;
      setRoute(ids.includes(h) ? h : fallback);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, [ids, fallback]);

  const go = useCallback((r: T) => {
    setRoute(r);
    window.history.replaceState(null, '', `#${r}`);
  }, []);

  return [route, go] as const;
};
