import { useState } from 'react';
import { Tabs, type Item } from '@/ui/kit/tabs';
import { Crack } from '@/ui/views/hash/crack';
import { Make } from '@/ui/views/hash/make';
import s from '@/ui/views/hash/hash.module.css';

type Mode = 'crack' | 'make';

const modes: Item<Mode>[] = [
  { id: 'crack', label: 'Identify & crack', icon: 'key' },
  { id: 'make', label: 'Generate', icon: 'hash' },
];

export function Hash() {
  const [mode, setMode] = useState<Mode>('crack');
  return (
    <div className={s.wrap}>
      <Tabs items={modes} value={mode} onChange={setMode} label="Hash mode" size="sm" />
      {mode === 'crack' ? <Crack /> : <Make />}
    </div>
  );
}
