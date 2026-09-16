import type { Metadata } from 'next';
import HomeGateway from '@/components/home/HomeGateway';

export const metadata: Metadata = {
  title: 'Recepce.tech — Matyáš · weby a virtuální asistenti pro firmy',
  description:
    'Jsem Matyáš. Stavím weby, které mají vlastní charakter, a virtuální asistenty, kteří za firmy zvládnou zákaznickou komunikaci — telefon, chat i rezervace.',
};

export default function Home() {
  return <HomeGateway />;
}
