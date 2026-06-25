import { FolderHeader } from "@/components/folder-detail/folder-header";
import FolderDetailClient from "@/components/folder-detail/folder-detail-client";
import { defaultFolderData } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function FolderDetailPage({ params }: Props) {
  const { slug } = await params;

  // In a real app, fetch from API. Here we use mock data.
  const initialFolder = defaultFolderData.find((f) => f.id === slug) || defaultFolderData[0];

  return (
    <main className="w-full max-w-[1200px] mx-auto p-4 md:p-6 space-y-8 grow mb-16 md:mb-0">
      <FolderHeader name={initialFolder.name} desc={initialFolder.desc} />

      <FolderDetailClient initialFolder={initialFolder} />
    </main>
  );
}
