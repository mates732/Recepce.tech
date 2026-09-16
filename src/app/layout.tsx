import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Recepce.tech — weby a virtuální asistenti',
    template: '%s — Recepce.tech',
  },
  description:
    'Recepce.tech spojuje dvě věci: weby s vlastním charakterem a virtuální asistenty, kteří zvednou telefon. Vyberte si svět, který vás zajímá.',
  metadataBase: new URL('https://www.recepce.tech'),
  openGraph: {
    title: 'Recepce.tech — weby a virtuální asistenti',
    description:
      'Weby s vlastním charakterem a asistenti, kteří zvednou telefon — dva světy jedné značky.',
    url: 'https://www.recepce.tech',
    siteName: 'Recepce.tech',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" data-scroll-behavior="smooth" className={`${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
