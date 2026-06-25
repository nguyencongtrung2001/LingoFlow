"use client";

import { FolderCard, FolderCardProps } from "./folder-card";

export interface FolderGridProps {
  folders: Omit<FolderCardProps, "onEdit" | "onDelete">[];
  onEditFolder?: (id: string, title: string, description: string) => void;
  onDeleteFolder?: (id: string) => void;
}

export function FolderGrid({
  folders,
  onEditFolder,
  onDeleteFolder,
}: FolderGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          {...folder}
          onEdit={onEditFolder}
          onDelete={onDeleteFolder}
        />
      ))}
    </div>
  );
}
