import type { Metadata } from 'next';
import LudmilaDemo from '@/components/demo/LudmilaDemo';

export const metadata: Metadata = {
  title: 'Textil Ludmila — demo',
  description:
    'Demo webu pro Textil Ludmila — metrový textil, závěsy na míru a stínění oken v Praze 6, s digitálním recepčním, který zvedne i mimo otevírací dobu.',
  alternates: { canonical: '/Ludmila' },
  // Ukázkový web pro konkrétního klienta nemá konkurovat jeho vlastnímu webu.
  robots: { index: false, follow: true },
};

export default function LudmilaPage() {
  return <LudmilaDemo />;
}
