import type { Args, Param } from '@/core/cipher';
import { Field } from '@/ui/kit/field';
import s from '@/ui/views/cipher/cipher.module.css';

type Props = { params: Param[]; args: Args; onChange: (a: Args) => void };

export function Params({ params, args, onChange }: Props) {
  if (!params.length) return null;
  return (
    <div className={s.params}>
      {params.map((p) => (
        <Field.Root key={p.id} label={p.label}>
          {(id) =>
            p.kind === 'int' ? (
              <Field.Step
                id={id}
                min={p.min}
                max={p.max}
                value={Number(args[p.id] ?? p.def)}
                onChange={(v) => onChange({ ...args, [p.id]: v })}
              />
            ) : (
              <Field.Line
                id={id}
                value={String(args[p.id] ?? p.def)}
                onChange={(e) => onChange({ ...args, [p.id]: e.target.value })}
              />
            )
          }
        </Field.Root>
      ))}
    </div>
  );
}
