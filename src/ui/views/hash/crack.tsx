import { useMemo, useRef, useState } from 'react';
import { algos, common, crack, identify, type Algo, type Found } from '@/core/hash';
import { Box } from '@/ui/kit/box';
import { Button } from '@/ui/kit/button';
import { Copy } from '@/ui/kit/copy';
import { Empty } from '@/ui/kit/empty';
import { Field } from '@/ui/kit/field';
import { Meter } from '@/ui/kit/meter';
import { Tag } from '@/ui/kit/tag';
import s from '@/ui/views/hash/hash.module.css';

type Run = { state: 'idle' } | { state: 'busy'; done: number } | { state: 'found'; hit: Found } | { state: 'miss' };

const LIMIT = 1_000_000;

export function Crack() {
  const [hash, setHash] = useState('');
  const [own, setOwn] = useState('');
  const [base, setBase] = useState(true);
  const [deep, setDeep] = useState(true);
  const [run, setRun] = useState<Run>({ state: 'idle' });
  const stop = useRef<AbortController | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const kinds = useMemo(() => identify(hash), [hash]);
  const targets = [...new Set(kinds.flatMap((k) => (k.algo ? [k.algo] : [])))] as Algo[];
  const mine = useMemo(() => own.split(/\r?\n/).filter(Boolean).slice(0, LIMIT), [own]);
  const words = useMemo(() => [...mine, ...(base ? common : [])], [mine, base]);

  const go = async () => {
    stop.current?.abort();
    const ctl = new AbortController();
    stop.current = ctl;
    setRun({ state: 'busy', done: 0 });
    const hit = await crack(hash, {
      words,
      algos: targets,
      deep,
      signal: ctl.signal,
      tick: (d, t) => setRun({ state: 'busy', done: d / t }),
    });
    if (ctl.signal.aborted) return setRun({ state: 'idle' });
    setRun(hit ? { state: 'found', hit } : { state: 'miss' });
  };

  const edit = (v: string) => {
    stop.current?.abort();
    setHash(v);
    setRun({ state: 'idle' });
  };

  const load = async (f?: File) => {
    if (f) setOwn((await f.text()).split(/\r?\n/).slice(0, LIMIT).join('\n'));
  };

  return (
    <div className={s.grid}>
      <Box.Panel title="Identify" icon="hash">
        <Field.Root label="Hash" icon="lock">
          {(id) => (
            <Field.Area
              id={id}
              rows={3}
              value={hash}
              placeholder="5f4dcc3b5aa765d61d8327deb882cf99"
              onChange={(e) => edit(e.target.value.trim())}
            />
          )}
        </Field.Root>
        {!hash ? (
          <p className={s.note}>
            Paste a hash to see what algorithm produced it. MD5, MD4, NTLM and the SHA family can be cracked here
            with a wordlist; salted schemes like bcrypt are identified only.
          </p>
        ) : kinds.length ? (
          <div className={s.kinds}>
            {kinds.map((k) => (
              <Tag key={k.id} tone={k.algo ? 'go' : 'warn'} title={k.note} extra={k.algo ? 'crackable' : k.note}>
                {k.name}
              </Tag>
            ))}
          </div>
        ) : (
          <p className={s.miss}>Unknown format. Check for stray characters, or try the Auto tab — it may be an encoding.</p>
        )}
      </Box.Panel>

      <Box.Panel title="Crack" icon="key">
        <Field.Root
          label="Your wordlist"
          hint={`${mine.length.toLocaleString('en')} custom words · ${words.length.toLocaleString('en')} total`}
          tools={
            <>
              <Button.Ghost size="sm" icon="upload" onClick={() => file.current?.click()}>
                Load .txt
              </Button.Ghost>
              <input
                ref={file}
                type="file"
                accept=".txt,.lst,.dic,text/plain"
                className={s.file}
                onChange={(e) => load(e.target.files?.[0])}
              />
            </>
          }
        >
          {(id) => (
            <Field.Area id={id} rows={4} value={own} placeholder="one word per line" onChange={(e) => setOwn(e.target.value)} />
          )}
        </Field.Root>
        <div className={s.opts}>
          <Button.Chip size="sm" on={base} onClick={() => setBase(!base)}>
            Common passwords ({common.length})
          </Button.Chip>
          <Button.Chip size="sm" on={deep} onClick={() => setDeep(!deep)} title="Password1, p4ssw0rd, drowssap, word2026…">
            Mutations
          </Button.Chip>
        </div>
        <div className={s.run}>
          {run.state === 'busy' ? (
            <>
              <Meter value={run.done} label="Progress" />
              <Button.Root size="sm" icon="stop" onClick={() => stop.current?.abort()}>
                Stop
              </Button.Root>
            </>
          ) : (
            <>
              <span className={s.note}>{targets.length ? targets.map((a) => algos[a].name).join(' · ') : 'Nothing to crack yet'}</span>
              <Button.Go size="sm" icon="play" disabled={!targets.length || !words.length} onClick={go}>
                Crack
              </Button.Go>
            </>
          )}
        </div>
        {run.state === 'found' && (
          <Box.Well className={s.found} aria-live="polite">
            <Tag tone="go">{algos[run.hit.algo].name}</Tag>
            <p className={s.word}>{run.hit.word}</p>
            <div>
              <Copy text={run.hit.word} />
            </div>
          </Box.Well>
        )}
        {run.state === 'miss' && (
          <p className={s.miss} aria-live="polite">
            Not in the wordlist. Load a bigger one (rockyou.txt works) or turn on mutations.
          </p>
        )}
        {run.state === 'idle' && !hash && <Empty icon="key" title="Waiting for a hash" />}
      </Box.Panel>
    </div>
  );
}
