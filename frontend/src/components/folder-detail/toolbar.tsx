"use client";

import { Search, LayoutGrid, Rows, List, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ExcelUploadButton } from "./excel-upload-button";

export type ViewMode = "grid" | "row" | "list";

export interface ToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  posFilter: string;
  setPosFilter: (pos: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAddWordClick: () => void;
  folderId: number;
}

export function Toolbar({
  searchQuery,
  setSearchQuery,
  posFilter,
  setPosFilter,
  viewMode,
  setViewMode,
  onAddWordClick,
  folderId,
}: ToolbarProps) {
  return (
    <section className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
      <div className="flex flex-wrap gap-2 flex-1 w-full items-center">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#464554] w-[18px] h-[18px]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#ffffff] border border-[#c7c4d7] rounded-lg text-[16px] text-[#0b1c30] placeholder:text-[#464554] focus-visible:ring-[#4648d4]/20 focus-visible:border-[#4648d4] h-[38px]"
            placeholder="Tìm kiếm từ vựng..."
          />
        </div>

        <Select value={posFilter} onValueChange={(val) => setPosFilter(val as string)}>
          <SelectTrigger className="w-[160px] h-[38px] bg-[#ffffff] border-[#c7c4d7] text-[#0b1c30] rounded-lg">
            <SelectValue placeholder="Tất cả từ loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả từ loại</SelectItem>
            <SelectItem value="NOUN">Danh từ (n)</SelectItem>
            <SelectItem value="VERB">Động từ (v)</SelectItem>
            <SelectItem value="ADJECTIVE">Tính từ (adj)</SelectItem>
            <SelectItem value="ADVERB">Trạng từ (adv)</SelectItem>
            <SelectItem value="PHRASE">Cụm từ (phrase)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-[#ffffff] border border-[#c7c4d7] rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`w-[34px] h-[34px] flex items-center justify-center rounded-md transition-colors ${
              viewMode === "grid"
                ? "bg-[#e1e0ff] text-[#4648d4]"
                : "text-[#464554] hover:bg-[#e5eeff]"
            }`}
            title="Lưới"
          >
            <LayoutGrid className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => setViewMode("row")}
            className={`w-[34px] h-[34px] flex items-center justify-center rounded-md transition-colors ${
              viewMode === "row"
                ? "bg-[#e1e0ff] text-[#4648d4]"
                : "text-[#464554] hover:bg-[#e5eeff]"
            }`}
            title="Hàng"
          >
            <Rows className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`w-[34px] h-[34px] flex items-center justify-center rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-[#e1e0ff] text-[#4648d4]"
                : "text-[#464554] hover:bg-[#e5eeff]"
            }`}
            title="Danh sách"
          >
            <List className="w-[18px] h-[18px]" />
          </button>
        </div>

        <ExcelUploadButton folderId={folderId} />

        <Button
          onClick={onAddWordClick}
          className="flex items-center gap-2 bg-[#4648d4] text-white px-6 py-2 h-[38px] rounded-lg font-semibold text-[14px] shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] hover:shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)] hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-[18px] h-[18px]" /> Thêm từ mới
        </Button>
      </div>
    </section>
  );
}
