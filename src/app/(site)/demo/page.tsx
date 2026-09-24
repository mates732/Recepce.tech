import type { Metadata } from 'next';
import DemoPageContent from '@/components/demo/DemoPageContent';
import { getDefaultShowcase } from '@/lib/demo-showcase';

/**
 * Veřejné demo Recepce.tech — výchozí ukázka je UGO Salaterie (primární
 * demo pro klienta). Každé demo má navíc vlastní URL /demo/[slug]; přepínač
 * mezi nimi naviguje. Zákaznická ukázka, ne admin: žádná autentizace,
 * minimum textu nad demo kartou — hlasový hovor je hrdino.
 */

export const metadata: Metadata = {
  /* absolute — root layout má šablonu „%s — Recepce.tech“, aby se přípona neduplikovala */
  title: { absolute: 'AI recepce v praxi | Recepce.tech' },
  description:
    'Vyzkoušejte si AI hlasového asistenta Recepce.tech na reálném scénáři UGO Salaterie.',
  alternates: { canonical: '/demo' },
  openGraph: {
    title: 'AI recepce v praxi | Recepce.tech',
    description:
      'Vyzkoušejte si AI hlasového asistenta Recepce.tech na reálném scénáři UGO Salaterie.',
    url: 'https://www.recepce.tech/demo',
    siteName: 'Recepce.tech',
    locale: 'cs_CZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI recepce v praxi | Recepce.tech',
    description:
      'Vyzkoušejte si AI hlasového asistenta Recepce.tech na reálném scénáři UGO Salaterie.',
  },
};

export default function DemoPage() {
  return <DemoPageContent showcase={getDefaultShowcase()} />;
}
