import type { Metadata } from 'next';
import LudmilaDemo from '@/components/demo/LudmilaDemo';

export const metadata: Metadata = {
  title: 'Textil Ludmila — digitální recepční',
  description:
    'Vyzkoušejte digitálního recepčního pro Textil Ludmila — zeptejte se na metrový textil, šití závěsů na míru a stínění oken v Praze 6. Odpoví i mimo otevírací dobu.',
  alternates: { canonical: '/Ludmila' },
  // Ukázkový web pro konkrétního klienta nemá konkurovat jeho vlastnímu webu.
  robots: { index: false, follow: true },
};

export default function LudmilaPage() {
  return <LudmilaDemo />;
}
