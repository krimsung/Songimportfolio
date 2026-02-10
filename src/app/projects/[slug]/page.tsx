import { ProjectDetail } from '../../components/project-detail';
import { notFound } from 'next/navigation';
import { projectsBySlug } from '../../data/projects';

interface PageProps {
  params: { slug: string };
}

export default function ProjectPage({ params }: PageProps) {
  const { slug } = params;
  const project = projectsBySlug[slug];

  if (!project) {
    notFound();
  }

  return <ProjectDetail projectId={slug} />;
}