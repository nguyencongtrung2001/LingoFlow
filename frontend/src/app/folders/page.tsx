import { FolderStats } from "@/components/folder/folder-stats";
import FoldersClient from "@/components/folder/folders-client";

export default function FoldersPage() {
  return (
    <div className="bg-[#f2f2f7] text-[#1a1a2e] min-h-screen font-sans flex flex-col pb-16 md:pb-0">
      <main className="w-full max-w-[1200px] mx-auto p-[20px] grow mt-4">
        <FolderStats
          totalFolders={12}
          totalWords={348}
          masteryRate={61}
          quizAccuracy={82}
        />

        <FoldersClient />
      </main>
    </div>
  );
}
