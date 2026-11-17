import { Button } from '@/ui/kit/button';
import { useClip } from '@/ui/hooks/clip';

type Props = { text: string; label?: string };

export function Copy({ text, label = 'Copy' }: Props) {
  const { done, copy } = useClip();
  return (
    <Button.Ghost size="sm" icon={done ? 'check' : 'copy'} onClick={() => copy(text)} disabled={!text} aria-live="polite">
      {done ? 'Copied' : label}
    </Button.Ghost>
  );
}
