import { ProjectDetail } from "../../components/project-detail";
import { slugToId } from "../../utils/projectMapping";

interface ProjectPageProps {
  slug: string;
}

export default function ProjectPage({ slug }: ProjectPageProps) {
  const projectId = slugToId[slug];

  if (!projectId) {
    return (
      <div className="min-h-screen bg-[#F3F2F0] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-[#1C1A1F]">Project not found</h1>
          <p className="text-[#7E7A75] mt-2">Check the URL and try again.</p>
        </div>
      </div>
    );
  }

  return <ProjectDetail projectId={projectId} />;
}