import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '@/ui/lib/cx';
import { Icon, type Glyph } from '@/ui/kit/icon';
import s from '@/ui/kit/button/button.module.css';

export type Tone = 'base' | 'go' | 'ghost' | 'chip';

export type Props = ComponentPropsWithoutRef<'button'> & {
  tone?: Tone;
  size?: 'sm' | 'md';
  icon?: Glyph;
  on?: boolean;
};

export function Root({ tone = 'base', size = 'md', icon, on, type = 'button', className, children, ...rest }: Props) {
  return (
    <button
      type={type}
      className={cx('px', s.btn, s[tone], s[size], on && s.on, className)}
      aria-pressed={tone === 'chip' ? Boolean(on) : undefined}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 12 : 14} />}
      {children}
    </button>
  );
}
