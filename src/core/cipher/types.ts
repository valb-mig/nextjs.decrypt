export type Group = 'encoding' | 'code' | 'classic' | 'transposition';

export type Param =
  | { id: string; label: string; kind: 'int'; min: number; max: number; def: number }
  | { id: string; label: string; kind: 'text'; def: string };

export type Args = Record<string, string | number>;

export type Guess = { args: Args; text: string; score: number };

export interface Cipher {
  id: string;
  name: string;
  group: Group;
  info: string;
  params: Param[];
  fits(src: string): boolean;
  decode(src: string, args: Args): string;
  encode(src: string, args: Args): string;
  crack?(src: string): Guess[];
}
