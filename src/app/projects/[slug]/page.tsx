import { ProjectDetail } from '../../components/project-detail';
import { notFound } from 'next/navigation';
import { slugToId } from '../../utils/projectMapping';

interface PageProps {
  params: { slug: string };
}

export default function ProjectPage({ params }: PageProps) {
  const { slug } = params;
  const projectId = slugToId[slug];

  if (!projectId) {
    notFound();
  }

  return <ProjectDetail projectId={projectId} />;
}