"use client";

import { useState } from "react";
import { FilePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PartOfSpeech } from "@/types/folder";

export interface AddWordPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onAddWord: (wordData: {
    word: string;
    meaning: string;
    phonetic: string;
    pos: PartOfSpeech;
    example: string;
    image: string;
  }) => void;
}

export function AddWordPanel({
  isVisible,
  onClose,
  onAddWord,
}: AddWordPanelProps) {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [pos, setPos] = useState<PartOfSpeech>("Noun");
  const [example, setExample] = useState("");
  const [image, setImage] = useState("");

  if (!isVisible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) {
      alert("Vui lòng điền Từ vựng và Nghĩa tiếng Việt!");
      return;
    }

    onAddWord({
      word: word.trim(),
      meaning: meaning.trim(),
      phonetic: phonetic.trim(),
      pos,
      example: example.trim(),
      image: image.trim(),
    });

    // Reset fields
    setWord("");
    setMeaning("");
    setPhonetic("");
    setPos("Noun");
    setExample("");
    setImage("");
    onClose();
  };

  return (
    <section className="bg-[#e5eeff] rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] border border-[#c7c4d7]/30 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[24px] text-[#0b1c30] font-bold flex items-center gap-2">
            <FilePlus className="text-[#4648d4] w-6 h-6" /> Thêm từ vựng mới
          </h3>
          <button
            onClick={onClose}
            className="text-[#464554] hover:text-[#ba1a1a] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#464554] mb-1">
                Từ vựng *
              </label>
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="w-full px-4 py-2 bg-[#ffffff] border border-[#c7c4d7] rounded-lg text-[16px] text-[#0b1c30] focus-visible:ring-[#4648d4]/20 focus-visible:border-[#4648d4]"
                placeholder="Ví dụ: Algorithm"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[12px] font-medium text-[#464554] mb-1">
                  Phiên âm
                </label>
                <Input
                  value={phonetic}
                  onChange={(e) => setPhonetic(e.target.value)}
                  className="w-full px-4 py-2 bg-[#ffffff] border border-[#c7c4d7] rounded-lg text-[16px] text-[#0b1c30] focus-visible:ring-[#4648d4]/20 focus-visible:border-[#4648d4]"
                  placeholder="/ˈæl.ɡə.rɪ.ðəm/"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-[12px] font-medium text-[#464554] mb-1">
                  Từ loại
                </label>
                <Select
                  value={pos}
                  onValueChange={(val) => setPos(val as PartOfSpeech)}
                >
                  <SelectTrigger className="w-full h-10 bg-[#ffffff] border-[#c7c4d7] text-[#0b1c30] rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Noun">Noun</SelectItem>
                    <SelectItem value="Verb">Verb</SelectItem>
                    <SelectItem value="Adjective">Adjective</SelectItem>
                    <SelectItem value="Adverb">Adverb</SelectItem>
                    <SelectItem value="Phrase">Phrase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#464554] mb-1">
                Nghĩa tiếng Việt *
              </label>
              <Input
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                className="w-full px-4 py-2 bg-[#ffffff] border border-[#c7c4d7] rounded-lg text-[16px] text-[#0b1c30] focus-visible:ring-[#4648d4]/20 focus-visible:border-[#4648d4]"
                placeholder="Thuật toán"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#464554] mb-1">
                Ví dụ (Câu)
              </label>
              <Textarea
                value={example}
                onChange={(e) => setExample(e.target.value)}
                className="w-full px-4 py-2 bg-[#ffffff] border border-[#c7c4d7] rounded-lg text-[16px] text-[#0b1c30] focus-visible:ring-[#4648d4]/20 focus-visible:border-[#4648d4] resize-none"
                placeholder="Machine learning relies on complex algorithms."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#464554] mb-1">
                Hình ảnh minh họa (URL)
              </label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2 bg-[#ffffff] border border-[#c7c4d7] rounded-lg text-[16px] text-[#0b1c30] focus-visible:ring-[#4648d4]/20 focus-visible:border-[#4648d4]"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 mt-2 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-semibold text-[#4648d4] border-[#4648d4] hover:bg-[#4648d4]/5 transition-colors"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold bg-[#4648d4] text-white shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] hover:shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)] hover:-translate-y-0.5 transition-all"
            >
              Lưu từ vựng
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
