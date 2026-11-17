import type { ReactNode } from 'react';
import { cx } from '@/ui/lib/cx';
import s from '@/ui/kit/tag/tag.module.css';

type Props = { children: ReactNode; extra?: ReactNode; tone?: 'base' | 'go' | 'warn'; title?: string };

export function Tag({ children, extra, tone = 'base', title }: Props) {
  return (
    <span className={cx('px', s.tag, tone !== 'base' && s[tone])} title={title}>
      {children}
      {extra && <span className={s.args}>{extra}</span>}
    </span>
  );
}
