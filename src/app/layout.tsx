import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Mindspace — The Engine | Matyáš Vojan',
  description:
    'Vstupte do mysli, kde se myšlenky mění v 110% realitu. AI vývojář, 3D vizualizace, neurální síť.',
  keywords: [
    'Matyáš Vojan',
    'AI vývojář',
    'Mindspace',
    'React Three Fiber',
    'Next.js',
    'AI Agent',
  ],
  openGraph: {
    title: 'Mindspace — The Engine',
    description:
      'Interaktivní digitální simulace mysli — AI, 3D, a 110% dotažení.',
    type: 'website',
    locale: 'cs_CZ',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="cs"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
