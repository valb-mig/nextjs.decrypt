import type { ReactNode } from 'react';
import { Icon, type Glyph } from '@/ui/kit/icon';
import s from '@/ui/kit/empty/empty.module.css';

type Props = { icon: Glyph; title: string; children?: ReactNode };

export function Empty({ icon, title, children }: Props) {
  return (
    <div className={s.empty}>
      <Icon name={icon} size={40} />
      <p className={s.title}>{title}</p>
      {children && <div className={s.text}>{children}</div>}
    </div>
  );
}
