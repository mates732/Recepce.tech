import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { projects } from "@/data/projects";
import ProjectContentSwitch from "./ProjectContentSwitch";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const title = `${project.name} — recepce.tech`;
  const description = locale === "cs" ? project.description.cs : project.description.en;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-body text-sm" style={{ color: "#666666" }}>
          {locale === "cs" ? "Projekt nenalezen." : "Project not found."}
        </p>
      </div>
    );
  }

  return <ProjectContentSwitch project={project} locale={locale as Locale} />;
}
