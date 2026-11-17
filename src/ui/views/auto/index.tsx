import { useState } from 'react';
import { rate } from '@/core/score';
import { cx } from '@/ui/lib/cx';
import { Box } from '@/ui/kit/box';
import { Button } from '@/ui/kit/button';
import { Empty } from '@/ui/kit/empty';
import { Field } from '@/ui/kit/field';
import { paste } from '@/ui/hooks/clip';
import { useSolve } from '@/ui/hooks/solve';
import { samples } from '@/ui/views/auto/samples';
import { Hit } from '@/ui/views/auto/hit';
import s from '@/ui/views/auto/auto.module.css';

export function Auto() {
  const [text, setText] = useState('');
  const { hits, ms, stale, done } = useSolve(text);
  const plain = done.trim() && !hits.length && rate(done) > 0.75;

  const tools = (
    <>
      <Button.Ghost
        size="sm"
        icon="paste"
        onClick={async () => {
          const t = await paste();
          if (t !== null) setText(t);
        }}
      >
        Paste
      </Button.Ghost>
      <Button.Ghost size="sm" icon="cross" onClick={() => setText('')} disabled={!text}>
        Clear
      </Button.Ghost>
    </>
  );

  return (
    <div className={s.grid}>
      <Box.Panel title="Mystery input" icon="lock">
        <Field.Root label="Ciphertext, encoding or riddle" tools={tools}>
          {(id) => (
            <Field.Area
              id={id}
              rows={9}
              value={text}
              autoFocus
              placeholder="Paste anything: 01001000 01101001, SGVsbG8=, .... ..  , Uryyb…"
              onChange={(e) => setText(e.target.value)}
            />
          )}
        </Field.Root>
        <div className={s.try}>
          <span>Try</span>
          {samples.map((x) => (
            <Button.Chip key={x.label} size="sm" on={text === x.text} onClick={() => setText(x.text)}>
              {x.label}
            </Button.Chip>
          ))}
        </div>
      </Box.Panel>

      <Box.Panel
        title="Results"
        icon="open"
        aria-busy={stale}
        tools={
          done && (
            <span className={s.meta} aria-live="polite">
              {stale ? 'Decrypting…' : `${hits.length} candidate${hits.length === 1 ? '' : 's'} · ${Math.max(1, Math.round(ms))} ms`}
            </span>
          )
        }
      >
        {!text.trim() ? (
          <Empty icon="bolt" title="Auto mode">
            Decrypt tries every decoder it knows — and chains of them, up to three layers deep — then ranks what
            reads most like English or Portuguese.
          </Empty>
        ) : hits.length ? (
          <ol className={cx(s.list, stale && s.busy)}>
            {hits.map((h, i) => (
              <Hit key={`${h.steps.map((x) => x.id).join('>')}:${h.text}`} hit={h} rank={i + 1} />
            ))}
          </ol>
        ) : stale ? (
          <Empty icon="bolt" title="Decrypting…" />
        ) : plain ? (
          <Empty icon="open" title="Already readable">
            This looks like plain text. Nothing to decode here.
          </Empty>
        ) : (
          <Empty icon="lock" title="Nothing readable yet">
            No decoder produced convincing text. Keyed ciphers with short input are hard to guess — try the Cipher tab
            and enter the key.
          </Empty>
        )}
      </Box.Panel>
    </div>
  );
}
