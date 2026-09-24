import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DemoPageContent from '@/components/demo/DemoPageContent';
import {
  findShowcaseBySlug,
  getAllShowcaseSlugs,
} from '@/lib/demo-showcase';

/**
 * Samostatná URL pro každé demo — /demo/ugo-stromovka, /demo/ludmila, …
 * Neznámý slug → 404. Všechny cesty se předrenderují (generateStaticParams).
 */

interface DemoSlugPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return getAllShowcaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DemoSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const showcase = findShowcaseBySlug(slug);

  if (!showcase) {
    return { title: 'Demo | Recepce.tech' };
  }

  const title = `${showcase.client} — AI recepce v praxi | Recepce.tech`;
  const description = `Vyzkoušejte si AI hlasového asistenta ${showcase.client} (${showcase.location}) na reálném scénáři Recepce.tech.`;

  return {
    title,
    description,
    alternates: { canonical: `/demo/${showcase.slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.recepce.tech/demo/${showcase.slug}`,
      siteName: 'Recepce.tech',
      locale: 'cs_CZ',
      type: 'website',
    },
  };
}

export default async function DemoSlugPage({ params }: DemoSlugPageProps) {
  const { slug } = await params;
  const showcase = findShowcaseBySlug(slug);

  if (!showcase) notFound();

  return <DemoPageContent showcase={showcase} />;
}
