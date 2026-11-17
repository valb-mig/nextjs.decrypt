'use client';

import { Tabs, type Item } from '@/ui/kit/tabs';
import { useRoute } from '@/ui/hooks/route';
import { Shell } from '@/ui/views/shell';
import { Auto } from '@/ui/views/auto';
import { Cipher } from '@/ui/views/cipher';
import { Hash } from '@/ui/views/hash';

type View = 'auto' | 'cipher' | 'hash';

const ids = ['auto', 'cipher', 'hash'] as const;

const items: Item<View>[] = [
  { id: 'auto', label: 'Auto', icon: 'bolt' },
  { id: 'cipher', label: 'Cipher', icon: 'key' },
  { id: 'hash', label: 'Hash', icon: 'hash' },
];

const views: Record<View, () => React.JSX.Element> = { auto: Auto, cipher: Cipher, hash: Hash };

export function App() {
  const [view, go] = useRoute(ids, 'auto');
  return (
    <Shell nav={<Tabs items={items} value={view} onChange={go} label="Mode" controls="view" />}>
      {ids.map((id) => {
        const View = views[id];
        return (
          <div key={id} hidden={id !== view}>
            <View />
          </div>
        );
      })}
    </Shell>
  );
}
