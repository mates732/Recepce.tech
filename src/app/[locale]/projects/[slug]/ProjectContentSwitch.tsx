"use client";

import type { Locale } from "@/lib/types";
import type { Project } from "@/data/projects";
import ProjectContent from "@/components/projects/ProjectContent";

interface Props {
  project: Project;
  locale: Locale;
}

export default function ProjectContentSwitch({ project, locale }: Props) {
  return <ProjectContent project={project} locale={locale} />;
}
