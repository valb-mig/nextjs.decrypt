import { useEffect, useState } from 'react';
import { algos, digest, type Algo } from '@/core/hash';
import { Box } from '@/ui/kit/box';
import { Copy } from '@/ui/kit/copy';
import { Field } from '@/ui/kit/field';
import { Tag } from '@/ui/kit/tag';
import s from '@/ui/views/hash/hash.module.css';

const order = Object.keys(algos) as Algo[];

export function Make() {
  const [text, setText] = useState('');
  const [out, setOut] = useState<Partial<Record<Algo, string>>>({});

  useEffect(() => {
    let live = true;
    Promise.all(order.map(async (a) => [a, await digest(a, text)] as const)).then((r) => {
      if (live) setOut(Object.fromEntries(r));
    });
    return () => {
      live = false;
    };
  }, [text]);

  return (
    <div className={s.grid}>
      <Box.Panel title="Text" icon="open">
        <Field.Root label="Input" hint="Hashed as UTF-8 (NTLM uses UTF-16LE).">
          {(id) => <Field.Area id={id} rows={6} value={text} onChange={(e) => setText(e.target.value)} />}
        </Field.Root>
      </Box.Panel>
      <Box.Panel title="Digests" icon="hash">
        <ul className={s.rows}>
          {order.map((a) => (
            <Box.Root as="li" tone="flat" key={a} className={s.row}>
              <Tag>{algos[a].name}</Tag>
              <code className={s.hex}>{out[a] ?? '…'}</code>
              <Copy text={out[a] ?? ''} label="" />
            </Box.Root>
          ))}
        </ul>
      </Box.Panel>
    </div>
  );
}
