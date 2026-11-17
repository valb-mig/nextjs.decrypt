import { Root, type Props, type Tone } from '@/ui/kit/button/root';

const make = (tone: Tone) =>
  function Variant(p: Omit<Props, 'tone'>) {
    return <Root tone={tone} {...p} />;
  };

export const Button = { Root, Go: make('go'), Ghost: make('ghost'), Chip: make('chip') };
