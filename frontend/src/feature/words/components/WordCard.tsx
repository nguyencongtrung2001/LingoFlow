import { useState } from "react";
import { Word } from "@/api/words.api";
import { useUpdateWord, useDeleteWord } from "../hooks/useWords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pen, Trash2, Volume2, Save, X, Loader2 } from "lucide-react";

interface WordCardProps {
  word: Word;
}

export function WordCard({ word: initialWord }: WordCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    word: initialWord.word,
    meaning: initialWord.meaning,
    pos: initialWord.pos,
    phonetic: initialWord.phonetic || "",
    example: initialWord.example || "",
  });

  const updateMutation = useUpdateWord(initialWord.folderId);
  const deleteMutation = useDeleteWord(initialWord.folderId);

  const posColors: Record<string, string> = {
    NOUN: "bg-blue-100 text-blue-700",
    VERB: "bg-green-100 text-green-700",
    ADJECTIVE: "bg-purple-100 text-purple-700",
    ADVERB: "bg-orange-100 text-orange-700",
    PHRASE: "bg-pink-100 text-pink-700",
  };

  const handleUpdate = () => {
    if (!formData.word.trim() || !formData.meaning.trim()) return;
    
    updateMutation.mutate(
      { id: initialWord.id, data: formData },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa từ "${initialWord.word}" không?`)) {
      deleteMutation.mutate(initialWord.id);
    }
  };

  const handleAudioPlay = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(initialWord.word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-[#4648d4] shadow-sm flex flex-col gap-3">
        <Input 
          value={formData.word}
          onChange={(e) => setFormData({ ...formData, word: e.target.value })}
          placeholder="Từ vựng tiếng Anh"
          className="font-bold text-lg"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input 
            value={formData.phonetic}
            onChange={(e) => setFormData({ ...formData, phonetic: e.target.value })}
            placeholder="Phát âm (VD: /həˈləʊ/)"
          />
          <select 
            value={formData.pos}
            onChange={(e) => setFormData({ ...formData, pos: e.target.value as any })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="NOUN">Danh từ (n)</option>
            <option value="VERB">Động từ (v)</option>
            <option value="ADJECTIVE">Tính từ (adj)</option>
            <option value="ADVERB">Trạng từ (adv)</option>
            <option value="PHRASE">Cụm từ (phrase)</option>
          </select>
        </div>
        <Input 
          value={formData.meaning}
          onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
          placeholder="Nghĩa tiếng Việt"
        />
        <Textarea 
          value={formData.example}
          onChange={(e) => setFormData({ ...formData, example: e.target.value })}
          placeholder="Ví dụ sử dụng (tùy chọn)"
          className="resize-none h-16"
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" size="sm" onClick={() => {
            setIsEditing(false);
            setFormData({
              word: initialWord.word,
              meaning: initialWord.meaning,
              pos: initialWord.pos,
              phonetic: initialWord.phonetic || "",
              example: initialWord.example || "",
            });
          }}>
            <X className="w-4 h-4 mr-1" /> Hủy
          </Button>
          <Button size="sm" onClick={handleUpdate} disabled={updateMutation.isPending || !formData.word.trim() || !formData.meaning.trim()} className="bg-[#4648d4] hover:bg-[#3b3db8] text-white">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            Lưu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-[#e5e7eb] hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-xl text-[#111827]">{initialWord.word}</h3>
            <button 
              onClick={handleAudioPlay}
              className="p-1.5 text-gray-400 hover:text-[#4648d4] hover:bg-[#f0f1ff] rounded-full transition-colors"
              title="Nghe phát âm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${posColors[initialWord.pos] || "bg-gray-100 text-gray-700"}`}>
              {initialWord.pos.toLowerCase()}
            </span>
            {initialWord.phonetic && (
              <span className="text-sm text-gray-500 font-mono tracking-wider">{initialWord.phonetic}</span>
            )}
          </div>
        </div>
        
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-400 hover:text-[#4648d4] hover:bg-[#f0f1ff] rounded-md transition-colors"
            title="Sửa từ"
          >
            <Pen className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Xóa từ"
          >
            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div className="mt-2 grow">
        <p className="text-[#1a1a2e] font-medium text-lg mb-2">{initialWord.meaning}</p>
        {initialWord.example && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic border-l-2 border-[#4648d4]">
            &rdquo;{initialWord.example}&ldquo;
          </div>
        )}
      </div>
    </div>
  );
}
