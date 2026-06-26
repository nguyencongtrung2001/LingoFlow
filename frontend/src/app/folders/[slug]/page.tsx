import FolderDetailClient from "@/components/folder-detail/folder-detail-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function FolderDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="w-full max-w-[1200px] mx-auto p-4 md:p-6 space-y-8 grow mb-16 md:mb-0">
      <FolderDetailClient slug={slug} />
    </main>
  );
}
