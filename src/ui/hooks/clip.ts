import { useEffect, useRef, useState } from 'react';

export const useClip = () => {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 1200);
    } catch {
      setDone(false);
    }
  };
  return { done, copy };
};

export const paste = async () => {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return null;
  }
};
