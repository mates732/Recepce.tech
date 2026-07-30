import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import ProjectsContent from "@/components/ProjectsContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "cs" ? "Projekty — Recepce.tech" : "Projects — Recepce.tech",
    description: locale === "cs"
      ? "Systémy, které jsme navrhli, postavili a spustili. AI, weby, automatizace a další."
      : "Systems we designed, built and launched. AI, websites, automation and more.",
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  return <ProjectsContent locale={locale as Locale} />;
}
