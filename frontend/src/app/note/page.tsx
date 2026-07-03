"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic import với ssr: false để tránh lỗi hydration từ @hello-pangea/dnd
const TrelloNotesBoard = dynamic(
  () => import("@/components/trello/TrelloNotesBoard"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[80vh] bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Đang tải bảng ghi chú...</p>
        </div>
      </div>
    ),
  }
);

export default function NotePage() {
  return <TrelloNotesBoard />;
}
