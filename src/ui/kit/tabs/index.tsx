import { useRef, type KeyboardEvent } from 'react';
import { cx } from '@/ui/lib/cx';
import { Icon, type Glyph } from '@/ui/kit/icon';
import s from '@/ui/kit/tabs/tabs.module.css';

export type Item<T extends string> = { id: T; label: string; icon?: Glyph };

type Props<T extends string> = {
  items: Item<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  size?: 'sm' | 'md';
  controls?: string;
};

export function Tabs<T extends string>({ items, value, onChange, label, size = 'md', controls }: Props<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + items.length) % items.length;
    onChange(items[n].id);
    refs.current[n]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className={cx(s.list, size === 'sm' && s.sm)}>
      {items.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          role="tab"
          type="button"
          aria-selected={t.id === value}
          aria-controls={controls}
          tabIndex={t.id === value ? 0 : -1}
          className={cx('px', s.tab)}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => move(e, i)}
        >
          {t.icon && <Icon name={t.icon} size={size === 'sm' ? 12 : 14} />}
          {t.label}
        </button>
      ))}
    </div>
  );
}
