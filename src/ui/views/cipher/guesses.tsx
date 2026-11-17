import type { Args, Guess } from '@/core/cipher';
import { cx } from '@/ui/lib/cx';
import { Box } from '@/ui/kit/box';
import { Button } from '@/ui/kit/button';
import { Meter } from '@/ui/kit/meter';
import { Tag } from '@/ui/kit/tag';
import s from '@/ui/views/cipher/cipher.module.css';

const label = (a: Args) =>
  Object.entries(a)
    .map(([k, v]) => `${k} ${v}`)
    .join(' · ');

type Props = { list: Guess[]; onUse: (a: Args) => void };

export function Guesses({ list, onUse }: Props) {
  if (!list.length) return <p className={s.note}>Not enough text to guess a key. Longer input helps a lot.</p>;
  return (
    <ol className={s.guesses}>
      {list.map((g, i) => (
        <Box.Root as="li" tone="flat" key={JSON.stringify(g.args)} className={cx(s.guess, i === 0 && s.top)}>
          <Tag tone={i === 0 ? 'go' : 'base'}>{label(g.args)}</Tag>
          <span className={s.preview} title={g.text}>
            {g.text}
          </span>
          <Meter value={g.score} percent={false} />
          <Button.Ghost size="sm" onClick={() => onUse(g.args)}>
            Use
          </Button.Ghost>
        </Box.Root>
      ))}
    </ol>
  );
}
