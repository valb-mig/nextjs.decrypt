import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/ui/lib/cx';
import { Icon, type Glyph } from '@/ui/kit/icon';
import s from '@/ui/kit/box/box.module.css';

type Tone = 'raised' | 'sunk' | 'flat';

type RootProps = HTMLAttributes<HTMLElement> & { tone?: Tone; as?: 'div' | 'section' | 'article' | 'li' };

function Root({ tone = 'raised', as = 'div', className, ...rest }: RootProps) {
  const El: ElementType = as;
  return <El className={cx('px', s.box, s[tone], className)} {...rest} />;
}

type PanelProps = Omit<RootProps, 'title'> & { title?: ReactNode; icon?: Glyph; tools?: ReactNode };

function Panel({ title, icon, tools, children, className, ...rest }: PanelProps) {
  return (
    <Root as="section" className={cx(s.panel, className)} {...rest}>
      {(title || tools) && (
        <header className={s.head}>
          <h2 className={s.title}>
            {icon && <Icon name={icon} size={18} />}
            {title}
          </h2>
          {tools && <div className={s.tools}>{tools}</div>}
        </header>
      )}
      {children}
    </Root>
  );
}

function Well(p: Omit<RootProps, 'tone'>) {
  return <Root tone="sunk" {...p} />;
}

export const Box = { Root, Panel, Well };
