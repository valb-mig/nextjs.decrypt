import { cx } from '@/ui/lib/cx';
import s from '@/ui/kit/meter/meter.module.css';

type Props = { value: number; cells?: number; label?: string; percent?: boolean };

export function Meter({ value, cells = 10, label = 'Confidence', percent = true }: Props) {
  const v = Math.min(1, Math.max(0, value));
  const lit = Math.round(v * cells);
  const tier = v >= 0.7 ? s.high : v >= 0.45 ? s.mid : s.low;
  return (
    <span
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      className={cx(s.meter, tier)}
    >
      <span className={s.cells}>
        {Array.from({ length: cells }, (_, i) => (
          <span key={i} className={cx(s.cell, i < lit && s.lit)} />
        ))}
      </span>
      {percent && <span className={s.value}>{Math.round(v * 100)}%</span>}
    </span>
  );
}
