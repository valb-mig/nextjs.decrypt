import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '@/ui/lib/cx';
import { Icon, type Glyph } from '@/ui/kit/icon';
import { Button } from '@/ui/kit/button';
import s from '@/ui/kit/field/field.module.css';

type RootProps = {
  label: ReactNode;
  icon?: Glyph;
  hint?: ReactNode;
  tools?: ReactNode;
  children: (id: string) => ReactNode;
  className?: string;
};

function Root({ label, icon, hint, tools, children, className }: RootProps) {
  const id = useId();
  return (
    <div className={cx(s.field, className)}>
      <div className={s.top}>
        <label htmlFor={id} className={s.label}>
          {icon && <Icon name={icon} size={14} />}
          {label}
        </label>
        {tools && <div className={s.tools}>{tools}</div>}
      </div>
      {children(id)}
      {hint && <p className={s.hint}>{hint}</p>}
    </div>
  );
}

function Area({ className, ...rest }: ComponentPropsWithoutRef<'textarea'>) {
  return <textarea spellCheck={false} className={cx('px', s.input, s.area, className)} {...rest} />;
}

function Line({ className, ...rest }: ComponentPropsWithoutRef<'input'>) {
  return <input spellCheck={false} autoComplete="off" className={cx('px', s.input, s.line, className)} {...rest} />;
}

type StepProps = { id?: string; value: number; min: number; max: number; onChange: (v: number) => void };

function Step({ id, value, min, max, onChange }: StepProps) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, Number.isFinite(v) ? Math.trunc(v) : min)));
  return (
    <div className={s.step}>
      <Button.Root size="sm" aria-label="Decrease" onClick={() => set(value - 1)} disabled={value <= min}>
        −
      </Button.Root>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(e.target.valueAsNumber)}
        className={cx('px', s.input, s.num)}
      />
      <Button.Root size="sm" aria-label="Increase" onClick={() => set(value + 1)} disabled={value >= max}>
        +
      </Button.Root>
    </div>
  );
}

export const Field = { Root, Area, Line, Step };
