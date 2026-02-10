import { ProjectDetail } from "../../components/project-detail";
import { projectsBySlug } from "../../data/projects";

interface PageProps {
  params: { slug: string };
}

export default function ProjectPage({ params }: PageProps) {
  const { slug } = params;
  const project = projectsBySlug[slug];

  if (!project) {
    return null;
  }

  return <ProjectDetail projectId={slug} />;
}