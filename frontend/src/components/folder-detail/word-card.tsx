"use client";

import { useState } from "react";

import { Edit, Trash2, Heart, Check, X, Volume2 } from "lucide-react";
import { Word, PartOfSpeech } from "@/types/folder";
import { ViewMode } from "./toolbar";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface WordCardProps {
  word: Word;
  viewMode: ViewMode;
  onEdit: (id: number, updates: Partial<Word>) => void;
  onDelete: (id: number) => void;
  onToggleLearned: (id: number) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
}

const posMap: Record<PartOfSpeech, { label: string; cls: string }> = {
  NOUN: { label: "n", cls: "bg-[#e1e0ff] text-[#3c3489]" },
  VERB: { label: "v", cls: "bg-[#d0f4e7] text-[#00714d]" },
  ADJECTIVE: { label: "adj", cls: "bg-[#ffddb8] text-[#653e00]" },
  ADVERB: { label: "adv", cls: "bg-[#f4c0d1] text-[#72243e]" },
  PHRASE: { label: "phr", cls: "bg-[#d3e4fe] text-[#185fa5]" },
};

function PosBadge({ pos }: { pos: PartOfSpeech }) {
  const p = posMap[pos] || {
    label: pos.toLowerCase(),
    cls: "bg-[#e5eeff] text-[#464554]",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.cls}`}
    >
      {p.label}
    </span>
  );
}

export function WordCard({
  word,
  viewMode,
  onEdit,
  onDelete,
  onToggleLearned,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect,
}: WordCardProps) {
  const isLoved = word.learned;

  const [isEditing, setIsEditing] = useState(false);
  const [editWord, setEditWord] = useState(word.word);
  const [editMeaning, setEditMeaning] = useState(word.meaning);
  const [editPos, setEditPos] = useState<PartOfSpeech>(word.pos);
  const [editPhonetic, setEditPhonetic] = useState(word.phonetic || "");
  const [editExample, setEditExample] = useState(word.example || "");
  const [editImage, setEditImage] = useState(word.image || "");

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editWord.trim() && editMeaning.trim()) {
      onEdit(word.id, {
        word: editWord.trim(),
        meaning: editMeaning.trim(),
        pos: editPos,
        phonetic: editPhonetic.trim(),
        example: editExample.trim(),
        image: editImage.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditWord(word.word);
    setEditMeaning(word.meaning);
    setEditPos(word.pos);
    setEditPhonetic(word.phonetic || "");
    setEditExample(word.example || "");
    setEditImage(word.image || "");
    setIsEditing(false);
  };

  const handlePronounce = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isEditing) {
    return (
      <article
        className={`bg-[#f8f9ff] rounded-xl shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] border border-[#4648d4] p-4 flex flex-col gap-3 ${
          viewMode === "list" ? "col-span-full mx-4 my-2" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-semibold text-[14px] text-[#4648d4]">Sửa từ vựng</h4>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="w-7 h-7 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center hover:bg-[#ffb4ab] transition-colors"
              title="Hủy"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="w-7 h-7 rounded-full bg-[#d0f4e7] text-[#00714d] flex items-center justify-center hover:bg-[#6cf8bb] transition-colors"
              title="Lưu"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input
            className="col-span-2 px-3 py-1.5 border border-[#c7c4d7] rounded-lg text-[14px] outline-none focus:border-[#4648d4] bg-white"
            placeholder="Từ vựng"
            value={editWord}
            onChange={(e) => setEditWord(e.target.value)}
            autoFocus
          />
          <select
            className="col-span-1 px-2 py-1.5 border border-[#c7c4d7] rounded-lg text-[14px] outline-none focus:border-[#4648d4] bg-white"
            value={editPos}
            onChange={(e) => setEditPos(e.target.value as PartOfSpeech)}
          >
            <option value="NOUN">Noun</option>
            <option value="VERB">Verb</option>
            <option value="ADJECTIVE">Adjective</option>
            <option value="ADVERB">Adverb</option>
            <option value="PHRASE">Phrase</option>
          </select>
        </div>
        <input
          className="px-3 py-1.5 border border-[#c7c4d7] rounded-lg text-[14px] outline-none focus:border-[#4648d4] bg-white"
          placeholder="Nghĩa tiếng Việt"
          value={editMeaning}
          onChange={(e) => setEditMeaning(e.target.value)}
        />
        <input
          className="px-3 py-1.5 border border-[#c7c4d7] rounded-lg text-[14px] outline-none focus:border-[#4648d4] bg-white"
          placeholder="Phiên âm (vd: /wɜːd/)"
          value={editPhonetic}
          onChange={(e) => setEditPhonetic(e.target.value)}
        />
        <input
          className="px-3 py-1.5 border border-[#c7c4d7] rounded-lg text-[14px] outline-none focus:border-[#4648d4] bg-white"
          placeholder="Hình ảnh minh họa (URL)"
          value={editImage}
          onChange={(e) => setEditImage(e.target.value)}
        />
        <textarea
          className="px-3 py-2 border border-[#c7c4d7] rounded-lg text-[14px] outline-none focus:border-[#4648d4] bg-white resize-none h-16"
          placeholder="Ví dụ"
          value={editExample}
          onChange={(e) => setEditExample(e.target.value)}
        />
      </article>
    );
  }

  if (viewMode === "list") {
    return (
      <div 
        className={`group relative flex flex-row items-center p-[10px_16px] gap-3 bg-[#f8f9ff] border-b border-[#e5eeff] last:border-b-0 hover:bg-[#eff4ff] transition-colors cursor-pointer ${isSelected ? "bg-[#e5eeff]" : ""}`}
        onClick={() => {
          if (isSelectionMode && onToggleSelect) onToggleSelect(word.id);
        }}
      >
        {isSelectionMode && (
          <div className="flex items-center justify-center mr-2 shrink-0">
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-[#4648d4] border-[#4648d4]" : "border-[#c7c4d7] bg-white"}`}>
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="flex items-center gap-2 mb-0">
            <h3 className="text-[14px] font-bold text-[#4648d4] truncate">
              {word.word}
            </h3>
            <button
              onClick={(e) => handlePronounce(e, word.word)}
              className="text-[#4648d4] hover:bg-[#dce9ff] rounded-full p-1 transition-colors"
              title="Nghe phát âm"
            >
              <Volume2 className="w-[14px] h-[14px]" />
            </button>
            <PosBadge pos={word.pos} />
          </div>
          <p className="text-[13px] text-[#464554] font-medium ml-auto shrink-0">
            {word.meaning}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3">
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#464554]/60 hover:bg-[#6063ee]/20 hover:text-[#4648d4] transition-colors"
            title="Sửa"
          >
            <Edit className="w-[15px] h-[15px]" />
          </button>
          
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <button
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#464554]/60 hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors"
                  title="Xóa"
                  onClick={(e) => e.stopPropagation()}
                />
              }
            >
              <Trash2 className="w-[15px] h-[15px]" />
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Thao tác này không thể hoàn tác. Từ vựng &ldquo;{word.word}&rdquo; sẽ bị xóa vĩnh viễn.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#ba1a1a] text-white hover:bg-[#93000a] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(word.id);
                  }}
                >
                  Xóa từ vựng
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <div className="w-px h-[18px] bg-[#e5eeff] mx-[2px] shrink-0" />
          <button
            onClick={() => onToggleLearned(word.id)}
            className={`w-[30px] h-[30px] flex items-center justify-center rounded-full shrink-0 transition-colors ${
              isLoved ? "bg-[#fff0f3]" : "hover:bg-[#fff0f3]"
            }`}
            title={isLoved ? "Bỏ yêu thích" : "Thêm yêu thích"}
          >
            <Heart
              className={`w-[18px] h-[18px] transition-colors ${
                isLoved ? "fill-[#ff4d6d] text-[#ff4d6d]" : "text-[#c7c4d7]"
              }`}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <article
      className={`group relative bg-[#f8f9ff] rounded-xl shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] border-2 transition-all duration-300 animate-in fade-in zoom-in-95 p-6 cursor-pointer ${
        viewMode === "row" ? "flex flex-row items-center gap-4 py-3 px-4" : ""
      } ${
        isSelected ? "border-[#4648d4] bg-[#f0f4ff]" : "border-[#c7c4d7]/30 hover:border-[#c7c4d7]/60"
      }`}
      onClick={() => {
        if (isSelectionMode && onToggleSelect) onToggleSelect(word.id);
      }}
    >
      {isSelectionMode && (
        <div className="absolute top-3 left-3 z-10 flex items-center justify-center">
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shadow-sm ${isSelected ? "bg-[#4648d4] border-[#4648d4]" : "border-[#c7c4d7] bg-white"}`}>
            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
        </div>
      )}

      {viewMode === "grid" && (
        <div className="flex justify-between items-start w-full mb-3">
          {word.image ? (
            <Image
              className="rounded-lg object-cover bg-[#d3e4fe] shrink-0 border border-[#e5eeff] w-16 h-16"
              src={word.image}
              alt={word.word}
              width={64}
              height={64}
            />
          ) : (
            <div className="w-16 h-16" />
          )}
          <PosBadge pos={word.pos} />
        </div>
      )}

      {viewMode === "row" && word.image && (
        <Image
          className="rounded-lg object-cover bg-[#d3e4fe] shrink-0 border border-[#e5eeff] w-12 h-12 mb-0 order-last"
          src={word.image}
          alt={word.word}
          width={64}
          height={64}
        />
      )}

      <div className="flex-1 min-w-0">
        <div className={`mb-3 ${viewMode === "row" ? "mb-0.5" : ""}`}>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-[20px] font-bold text-[#4648d4] truncate">
              {word.word}
            </h3>
            <button
              onClick={(e) => handlePronounce(e, word.word)}
              className="text-[#4648d4] hover:bg-[#dce9ff] rounded-full p-1 transition-colors"
              title="Nghe phát âm"
            >
              <Volume2 className="w-[18px] h-[18px]" />
            </button>
            {viewMode === "row" && <PosBadge pos={word.pos} />}
          </div>
          {word.phonetic && (
            <p className="text-[14px] text-[#464554] italic">
              {word.phonetic}
            </p>
          )}
        </div>

        <p
          className={`${
            viewMode === "row" ? "text-[15px]" : "text-[18px]"
          } text-[#0b1c30] font-semibold`}
        >
          {word.meaning}
        </p>

        {word.example && viewMode === "grid" && (
          <blockquote className="mt-2 border-l-4 border-[#4648d4] pl-3 py-1 text-[14px] text-[#464554] bg-[#eff4ff] rounded-r">
            {word.example}
          </blockquote>
        )}
      </div>

      <div
        className={`absolute top-3 right-3 flex items-center bg-[#f8f9ff]/90 backdrop-blur-sm rounded-full px-1 border border-[#e5eeff]/60 h-[34px] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${
          viewMode === "row" && word.image ? "right-[60px]" : ""
        }`}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#464554]/60 hover:bg-[#6063ee]/20 hover:text-[#4648d4] transition-colors"
          title="Sửa"
        >
          <Edit className="w-[17px] h-[17px]" />
        </button>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#464554]/60 hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors"
                title="Xóa"
                onClick={(e) => e.stopPropagation()}
              />
            }
          >
            <Trash2 className="w-[17px] h-[17px]" />
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              <AlertDialogDescription>
                Thao tác này không thể hoàn tác. Từ vựng &ldquo;{word.word}&rdquo; sẽ bị xóa vĩnh viễn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Hủy</AlertDialogCancel>
              <AlertDialogAction
                className="bg-[#ba1a1a] text-white hover:bg-[#93000a] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(word.id);
                }}
              >
                Xóa từ vựng
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="w-px h-[18px] bg-[#e5eeff] mx-[2px] shrink-0" />
        <button
          onClick={() => onToggleLearned(word.id)}
          className={`w-[30px] h-[30px] flex items-center justify-center rounded-full shrink-0 transition-colors ${
            isLoved ? "bg-[#fff0f3]" : "hover:bg-[#fff0f3]"
          }`}
          title={isLoved ? "Bỏ yêu thích" : "Thêm yêu thích"}
        >
          <Heart
            className={`w-[20px] h-[20px] transition-colors ${
              isLoved ? "fill-[#ff4d6d] text-[#ff4d6d]" : "text-[#c7c4d7]"
            }`}
          />
        </button>
      </div>
    </article>
  );
}
