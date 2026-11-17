import type { Hit as Data } from '@/core/solve';
import { cx } from '@/ui/lib/cx';
import { Box } from '@/ui/kit/box';
import { Copy } from '@/ui/kit/copy';
import { Icon } from '@/ui/kit/icon';
import { Meter } from '@/ui/kit/meter';
import { Tag } from '@/ui/kit/tag';
import s from '@/ui/views/auto/auto.module.css';

const args = (a: Record<string, string | number>) => {
  const v = Object.entries(a);
  return v.length ? v.map(([k, x]) => (v.length > 1 ? `${k}=${x}` : String(x))).join(' ') : undefined;
};

type Props = { hit: Data; rank: number };

export function Hit({ hit, rank }: Props) {
  const best = rank === 1 && hit.score >= 0.6;
  return (
    <Box.Root as="li" tone="flat" className={cx(s.hit, best && s.best)}>
      <div className={s.row}>
        <div className={s.chain}>
          <span className={s.rank}>#{rank}</span>
          {hit.steps.map((st, i) => (
            <span key={i} className={s.chain}>
              {i > 0 && <Icon name="arrow" size={10} />}
              <Tag tone={best ? 'go' : 'base'} extra={args(st.args)}>
                {st.name}
              </Tag>
            </span>
          ))}
        </div>
        <Meter value={hit.score} />
      </div>
      <p className={s.out}>{hit.text}</p>
      <div className={s.row}>
        <span />
        <Copy text={hit.text} />
      </div>
    </Box.Root>
  );
}
