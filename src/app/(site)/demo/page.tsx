import type { Metadata } from 'next';
import DemoHub from '@/components/demo/DemoHub';

export const metadata: Metadata = {
  title: 'Demo — Recepce.tech',
  description:
    'Vyzkoušejte si realna dema digitalnich asistentu a reseni vytvorenych v Recepce.tech.',
  alternates: { canonical: '/demo' },
};

export default function DemoPage() {
  return <DemoHub />;
}
