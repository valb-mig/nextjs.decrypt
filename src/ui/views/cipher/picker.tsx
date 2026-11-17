import { ciphers, groups, type Group } from '@/core/cipher';
import { Box } from '@/ui/kit/box';
import { Button } from '@/ui/kit/button';
import s from '@/ui/views/cipher/cipher.module.css';

type Props = { value: string; onChange: (id: string) => void };

export function Picker({ value, onChange }: Props) {
  return (
    <Box.Root as="section" className={s.side} aria-label="Cipher">
      {(Object.keys(groups) as Group[]).map((g) => (
        <div key={g} className={s.group}>
          <h3>{groups[g]}</h3>
          <div className={s.items}>
            {ciphers
              .filter((c) => c.group === g)
              .map((c) => (
                <Button.Chip key={c.id} size="sm" on={c.id === value} onClick={() => onChange(c.id)}>
                  {c.name}
                </Button.Chip>
              ))}
          </div>
        </div>
      ))}
    </Box.Root>
  );
}
