import { useMemo, useState } from 'react';
import { defaults, Fail, find, type Args, type Guess } from '@/core/cipher';
import { Box } from '@/ui/kit/box';
import { Button } from '@/ui/kit/button';
import { Copy } from '@/ui/kit/copy';
import { Field } from '@/ui/kit/field';
import { Icon } from '@/ui/kit/icon';
import { Tabs, type Item } from '@/ui/kit/tabs';
import { paste } from '@/ui/hooks/clip';
import { Guesses } from '@/ui/views/cipher/guesses';
import { Params } from '@/ui/views/cipher/params';
import { Picker } from '@/ui/views/cipher/picker';
import s from '@/ui/views/cipher/cipher.module.css';

type Mode = 'decode' | 'encode';

const modes: Item<Mode>[] = [
  { id: 'decode', label: 'Decode', icon: 'open' },
  { id: 'encode', label: 'Encode', icon: 'lock' },
];

const start = find('caesar')!;

export function Cipher() {
  const [c, setC] = useState(start);
  const [mode, setMode] = useState<Mode>('decode');
  const [args, setArgs] = useState<Args>(defaults(start.params));
  const [text, setText] = useState('');
  const [guesses, setGuesses] = useState<Guess[] | null>(null);

  const out = useMemo(() => {
    if (!text) return { text: '' };
    try {
      return { text: mode === 'decode' ? c.decode(text, args) : c.encode(text, args) };
    } catch (e) {
      return { text: '', error: e instanceof Fail ? e.message : 'Could not process this input' };
    }
  }, [c, mode, args, text]);

  const pick = (id: string) => {
    const next = find(id);
    if (!next) return;
    setC(next);
    setArgs(defaults(next.params));
    setGuesses(null);
  };

  const edit = (t: string) => {
    setText(t);
    setGuesses(null);
  };

  const flip = () => {
    setText(out.text);
    setMode(mode === 'decode' ? 'encode' : 'decode');
    setGuesses(null);
  };

  const crack = c.crack && mode === 'decode';

  return (
    <div className={s.grid}>
      <Picker value={c.id} onChange={pick} />
      <div className={s.main}>
        <Box.Panel
          title={c.name}
          icon="key"
          tools={<Tabs items={modes} value={mode} onChange={setMode} label="Direction" size="sm" />}
        >
          <p className={s.info}>{c.info}</p>
          <Params params={c.params} args={args} onChange={setArgs} />
          <div className={s.io}>
            <Field.Root
              label={mode === 'decode' ? 'Ciphertext' : 'Plaintext'}
              icon={mode === 'decode' ? 'lock' : 'open'}
              tools={
                <>
                  <Button.Ghost
                    size="sm"
                    icon="paste"
                    onClick={async () => {
                      const t = await paste();
                      if (t !== null) edit(t);
                    }}
                  >
                    Paste
                  </Button.Ghost>
                  <Button.Ghost size="sm" icon="cross" onClick={() => edit('')} disabled={!text}>
                    Clear
                  </Button.Ghost>
                </>
              }
            >
              {(id) => <Field.Area id={id} rows={8} value={text} onChange={(e) => edit(e.target.value)} />}
            </Field.Root>
            <Field.Root
              label={mode === 'decode' ? 'Plaintext' : 'Ciphertext'}
              icon={mode === 'decode' ? 'open' : 'lock'}
              tools={
                <>
                  <Button.Ghost size="sm" icon="swap" onClick={flip} disabled={!out.text}>
                    Swap
                  </Button.Ghost>
                  <Copy text={out.text} />
                </>
              }
            >
              {(id) => <Field.Area id={id} rows={8} value={out.text} readOnly aria-live="polite" />}
            </Field.Root>
          </div>
          {out.error && (
            <p className={s.error} role="alert">
              <Icon name="cross" size={12} />
              {out.error}
            </p>
          )}
        </Box.Panel>

        {crack && (
          <Box.Panel
            title="Find the key"
            icon="bolt"
            tools={
              <Button.Go size="sm" icon="play" disabled={!text.trim()} onClick={() => setGuesses(c.crack!(text))}>
                Brute force
              </Button.Go>
            }
          >
            {guesses ? (
              <Guesses
                list={guesses}
                onUse={(a) => {
                  setArgs({ ...args, ...a });
                }}
              />
            ) : (
              <p className={s.note}>
                Don&apos;t know the key? Decrypt will try every one and rank the results by how readable they are.
              </p>
            )}
          </Box.Panel>
        )}
      </div>
    </div>
  );
}
