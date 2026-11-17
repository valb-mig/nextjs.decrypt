import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Pixelify_Sans, VT323 } from 'next/font/google';
import './globals.css';

const ui = Pixelify_Sans({ subsets: ['latin'], variable: '--font-ui' });
const mono = VT323({ subsets: ['latin'], weight: '400', variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Decrypt — decode ciphers, encodings and hashes',
  description:
    'Paste a mystery string and Decrypt peels it layer by layer: Base64, hex, binary, Morse, Caesar, Vigenère, rail fence and more. Identifies and cracks hashes too. Runs entirely in your browser.',
};

export const viewport: Viewport = { themeColor: '#050714' };

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${ui.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
