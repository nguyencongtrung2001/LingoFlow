"use client";

import { Trophy, Clock, Target, ArrowLeft, RotateCcw, CheckCircle, XCircle } from "lucide-react";

export interface SentenceHistoryItem {
  wordId: number;
  word: string;
  meaning: string;
  sentence: string;
  score: number;
  isCorrect: boolean;
  feedback: string;
}

export interface SentencesResultProps {
  folderName: string;
  timeSeconds: number;
  totalCount: number;
  correctCount: number;
  avgScore: number;
  history: SentenceHistoryItem[];
  onRestart: () => void;
  onBack: () => void;
}

export function SentencesResult({
  folderName,
  timeSeconds,
  totalCount,
  correctCount,
  avgScore,
  history,
  onRestart,
  onBack,
}: SentencesResultProps) {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#1d9e75]";
    if (score > 60) return "text-[#b45309]";
    return "text-[#e53e3e]";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-[#f0fff4] border-[#1d9e75]/20";
    if (score > 60) return "bg-[#fffbeb] border-[#fde68a]/30";
    return "bg-[#fff5f5] border-[#e53e3e]/20";
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-8 min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#4648d4] to-[#7a7cff] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#4648d4]/20">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-[24px] font-extrabold text-[#0b1c30] mb-1">
            Kết quả viết câu
          </h2>
          <p className="text-[14px] text-[#464554] font-medium">
            Thư mục: {folderName}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-[#e5eeff] shadow-sm text-center">
            <Target className="w-5 h-5 text-[#4648d4] mx-auto mb-2" />
            <p className={`text-[24px] font-black font-mono ${getScoreColor(avgScore)}`}>{avgScore}</p>
            <p className="text-[11px] text-[#464554] font-bold uppercase mt-1">Điểm TB</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e5eeff] shadow-sm text-center">
            <CheckCircle className="w-5 h-5 text-[#1d9e75] mx-auto mb-2" />
            <p className="text-[24px] font-black font-mono text-[#1d9e75]">
              {correctCount}/{totalCount}
            </p>
            <p className="text-[11px] text-[#464554] font-bold uppercase mt-1">Đạt</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e5eeff] shadow-sm text-center">
            <Clock className="w-5 h-5 text-[#b45309] mx-auto mb-2" />
            <p className="text-[24px] font-black font-mono text-[#b45309]">{formatTime(timeSeconds)}</p>
            <p className="text-[11px] text-[#464554] font-bold uppercase mt-1">Thời gian</p>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-2xl border border-[#e5eeff] shadow-sm overflow-hidden mb-6">
          <div className="px-4 py-3 bg-[#f8f9ff] border-b border-[#e5eeff]">
            <h3 className="text-[13px] font-bold text-[#464554]">Chi tiết từng câu</h3>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {history.map((item, i) => (
              <div key={i} className={`px-4 py-3.5 ${getScoreBg(item.score)} border-l-4 ${
                item.isCorrect ? "border-l-[#1d9e75]" : "border-l-[#e53e3e]"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-[#1d9e75] shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#e53e3e] shrink-0" />
                      )}
                      <span className="text-[14px] font-bold text-[#0b1c30]">{item.word}</span>
                      <span className="text-[12px] text-[#464554]">({item.meaning})</span>
                    </div>
                    <p className="text-[13px] text-[#334155] italic truncate">&quot;{item.sentence}&quot;</p>
                    <p className="text-[12px] text-[#64748b] mt-1">{item.feedback}</p>
                  </div>
                  <span className={`text-[18px] font-black font-mono shrink-0 ${getScoreColor(item.score)}`}>
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 border border-[#4648d4] text-[#4648d4] rounded-xl font-semibold hover:bg-[#eff4ff] transition-colors duration-200 bg-white flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay về
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 bg-[#4648d4] text-white rounded-xl font-semibold hover:bg-[#6063ee] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Luyện tập tiếp
          </button>
        </div>
      </div>
    </div>
  );
}
