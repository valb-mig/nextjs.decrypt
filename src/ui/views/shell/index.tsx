import type { ReactNode } from 'react';
import { Icon } from '@/ui/kit/icon';
import s from '@/ui/views/shell/shell.module.css';

type Props = { nav: ReactNode; children: ReactNode };

export function Shell({ nav, children }: Props) {
  return (
    <div className={s.page}>
      <header className={s.top}>
        <div className={s.brand}>
          <Icon name="skull" size={44} className={s.mark} />
          <div>
            <h1 className={s.name}>
              DECRYPT<span className={s.caret}>_</span>
            </h1>
            <p className={s.tag}>ciphers · encodings · hashes — all in your browser</p>
          </div>
        </div>
        <nav aria-label="Mode">{nav}</nav>
      </header>
      <main className={s.main} id="view" role="tabpanel">
        {children}
      </main>
      <footer className={s.foot}>
        <span>
          Made by <a href="https://github.com/valb-mig">Valb.Mig</a>
        </span>
        <span>Nothing you paste leaves this page.</span>
        <a href="https://github.com/valb-mig/nextjs.decrypt">Source</a>
      </footer>
    </div>
  );
}
