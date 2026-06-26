import { useState } from "react";
import { useCreateWord } from "../hooks/useWords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, X } from "lucide-react";
import { PartOfSpeech } from "@/api/words.api";

interface CreateWordFormProps {
  folderId: number;
}

export function CreateWordForm({ folderId }: CreateWordFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    word: "",
    meaning: "",
    pos: "NOUN" as PartOfSpeech,
    phonetic: "",
    example: "",
  });

  const createMutation = useCreateWord(folderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.meaning.trim()) return;

    createMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({
          word: "",
          meaning: "",
          pos: "NOUN",
          phonetic: "",
          example: "",
        });
        setIsOpen(false);
      },
    });
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        className="bg-white hover:bg-gray-50 text-[#4648d4] border-2 border-dashed border-[#4648d4] w-full py-8 h-auto flex flex-col items-center gap-2 rounded-2xl transition-all shadow-sm"
      >
        <div className="w-10 h-10 rounded-full bg-[#f0f1ff] flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </div>
        <span className="font-semibold text-base">Thêm từ vựng mới</span>
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-[#1a1a2e]">Thêm từ vựng mới</h3>
        <Button type="button" variant="ghost" size="icon-sm" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Từ vựng (Tiếng Anh) <span className="text-red-500">*</span></label>
            <Input 
              value={formData.word}
              onChange={(e) => setFormData({ ...formData, word: e.target.value })}
              placeholder="VD: Apple"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Nghĩa tiếng Việt <span className="text-red-500">*</span></label>
            <Input 
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              placeholder="VD: Quả táo"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Loại từ</label>
            <select 
              value={formData.pos}
              onChange={(e) => setFormData({ ...formData, pos: e.target.value as PartOfSpeech })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="NOUN">Danh từ (n)</option>
              <option value="VERB">Động từ (v)</option>
              <option value="ADJECTIVE">Tính từ (adj)</option>
              <option value="ADVERB">Trạng từ (adv)</option>
              <option value="PHRASE">Cụm từ (phrase)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Phát âm (Tùy chọn)</label>
            <Input 
              value={formData.phonetic}
              onChange={(e) => setFormData({ ...formData, phonetic: e.target.value })}
              placeholder="VD: /ˈæpl/"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Ví dụ (Tùy chọn)</label>
          <Textarea 
            value={formData.example}
            onChange={(e) => setFormData({ ...formData, example: e.target.value })}
            placeholder="VD: I eat an apple every day."
            className="resize-none h-16"
          />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || !formData.word.trim() || !formData.meaning.trim()}
            className="bg-[#4648d4] hover:bg-[#3b3db8] text-white"
          >
            {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Tạo từ vựng
          </Button>
        </div>
      </div>
    </form>
  );
}
