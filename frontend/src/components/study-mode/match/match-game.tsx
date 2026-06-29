"use client";

import { useState, useEffect, useMemo } from "react";
import { FolderDetail } from "@/types/folder";
import { Clock, Layers, CheckCircle } from "lucide-react";
import { MatchResult } from "./match-result";
import { useSaveStudySession } from "@/feature/words/hooks/useWords";

export interface MatchGameProps {
  folder: FolderDetail;
  onBack: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

type CardType = 'word' | 'meaning';

interface MatchCard {
  id: string;
  wordId: number;
  type: CardType;
  content: string;
}

export function MatchGame({ folder, onBack }: MatchGameProps) {
  const folderId = parseInt(folder.id);
  const saveSessionMutation = useSaveStudySession(folderId);

  const [currentRound, setCurrentRound] = useState(1);
  const [dbPayload, setDbPayload] = useState<Array<{ wordId: number; isCorrect: boolean }>>([]);
  
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [wrongCardIds, setWrongCardIds] = useState<string[]>([]);

  const [time, setTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const storageKey = `match_best_${folder.id}`;
  const [bestRecord, setBestRecord] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`match_best_${folder.id}`);
      return stored ? parseInt(stored, 10) : null;
    }
    return null;
  });

  const totalWords = folder.words;
  const maxRounds = Math.max(1, Math.ceil(totalWords.length / 5));

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  // Khởi tạo cụm 5 từ cho đợt hiện tại bằng useMemo
  const cards = useMemo(() => {
    const startIdx = (currentRound - 1) * 5;
    const roundWords = totalWords.slice(startIdx, startIdx + 5);
    
    if (roundWords.length === 0) return [];

    const generatedCards: MatchCard[] = [];
    roundWords.forEach((w) => {
      generatedCards.push({ id: `w-${w.id}`, wordId: w.id, type: 'word', content: w.word });
      generatedCards.push({ id: `m-${w.id}`, wordId: w.id, type: 'meaning', content: w.meaning });
    });

    return shuffleArray(generatedCards);
  }, [currentRound, totalWords]);

  const handleSelectCard = (card: MatchCard) => {
    if (matchedIds.includes(card.wordId)) return;
    if (selectedCardId === card.id) return;
    if (wrongCardIds.length > 0) return; // Ngăn bấm khi đang chạy animation rung sai

    if (!selectedCardId) {
      setSelectedCardId(card.id);
    } else {
      const firstCard = cards.find(c => c.id === selectedCardId);
      
      if (firstCard && firstCard.wordId === card.wordId && firstCard.type !== card.type) {
        // GHÉP ĐÚNG
        const newMatched = [...matchedIds, card.wordId];
        setMatchedIds(newMatched);
        setSelectedCardId(null);

        // Ghi nhận ngầm ĐÚNG nếu từ này chưa có trong dbPayload
        const inPayload = dbPayload.some(p => p.wordId === card.wordId);
        if (!inPayload) {
          setDbPayload(p => [...p, { wordId: card.wordId, isCorrect: true }]);
        }

        // Kiểm tra xem đã dọn sạch đợt học hiện tại chưa
        const roundStartIdx = (currentRound - 1) * 5;
        const roundWordIds = totalWords.slice(roundStartIdx, roundStartIdx + 5).map(w => w.id);
        const isRoundCleared = roundWordIds.every(id => newMatched.includes(id));

        if (isRoundCleared) {
          if (currentRound < maxRounds) {
            // Chuyển đợt tiếp theo
            setTimeout(() => {
              setCurrentRound(prev => prev + 1);
              setSelectedCardId(null);
              setWrongCardIds([]);
            }, 300);
          } else {
            // Đợt cuối cùng -> Hoàn thành toàn bộ game
            if (bestRecord === null || time < bestRecord) {
              setBestRecord(time);
              localStorage.setItem(storageKey, time.toString());
            }

            // Gửi session lên backend
            const realCorrectCount = dbPayload.filter((d) => d.isCorrect).length;
            const realAccuracy = totalWords.length > 0 ? (realCorrectCount / totalWords.length) * 100 : 0;

            saveSessionMutation.mutate({
              folderId,
              mode: "MATCH",
              totalWords: totalWords.length,
              correctCount: realCorrectCount,
              accuracy: realAccuracy,
              timeSeconds: time,
              maxStreak: totalWords.length,
              details: dbPayload.map((d) => ({
                wordId: d.wordId,
                isCorrect: d.isCorrect,
              })),
            });

            setTimeout(() => setIsCompleted(true), 500);
          }
        }
      } else {
        // GHÉP SAI
        setWrongCardIds([selectedCardId, card.id]);

        // Ghi nhận ngầm SAI cho cả 2 từ
        const toAdd: Array<{ wordId: number; isCorrect: boolean }> = [];
        if (firstCard) {
          const inPayloadFirst = dbPayload.some(p => p.wordId === firstCard.wordId);
          if (!inPayloadFirst) {
            toAdd.push({ wordId: firstCard.wordId, isCorrect: false });
          }
        }
        const inPayloadSecond = dbPayload.some(p => p.wordId === card.wordId);
        if (!inPayloadSecond) {
          toAdd.push({ wordId: card.wordId, isCorrect: false });
        }
        if (toAdd.length > 0) {
          setDbPayload(p => [...p, ...toAdd]);
        }

        setTimeout(() => {
          setSelectedCardId(null);
          setWrongCardIds([]);
        }, 800);
      }
    }
  };

  const handleRestart = () => {
    setCurrentRound(1);
    setDbPayload([]);
    setMatchedIds([]);
    setSelectedCardId(null);
    setWrongCardIds([]);
    setTime(0);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (totalWords.length === 0) return null;

  if (isCompleted) {
    const matchedPairs = totalWords.map(w => ({
      word: w.word,
      meaning: w.meaning,
      phonetic: w.phonetic || ""
    }));

    return (
      <MatchResult
        timeSeconds={time}
        bestRecordSeconds={bestRecord}
        averageSpeed={`${(time / totalWords.length).toFixed(1)} giây / cặp`}
        matchedPairs={matchedPairs}
        onRestart={handleRestart}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="bg-[#eff4ff] text-[#0b1c30] flex flex-col overflow-hidden relative w-full rounded-3xl border border-[#e5eeff]/50 shadow-md">
      {/* Header */}
      <header className="w-full bg-white border-b border-[#e2e8f0] px-4 py-4 md:px-6 flex items-center justify-between">
        <span className="text-[14px] font-extrabold text-[#334155]">
          Tiến độ đợt: {currentRound} / {maxRounds}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#eff4ff] border border-[#dce9ff] rounded-xl px-4 py-2 shadow-sm">
            <Clock className="w-4 h-4 text-[#4648d4]" />
            <span className="text-[13px] font-bold text-[#4648d4]">
              {formatTime(time)}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#6063ee] rounded-xl px-4 py-2 shadow-sm">
            <Layers className="w-4 h-4 text-white" />
            <span className="text-[13px] font-bold text-white">
              Đã ghép: {matchedIds.length} / {totalWords.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="max-w-[1200px] mx-auto px-4 py-8 md:px-6 w-full">
        <div className="text-center mb-6">
          <p className="text-[14px] font-semibold text-[#64748b]">
            Tìm và ghép các cặp từ vựng và nghĩa tương ứng. Thao tác sai sẽ bị cộng phạt thời gian và đánh dấu tiến độ.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto content-start justify-items-stretch">
          {cards.map((card) => {
            const isMatched = matchedIds.includes(card.wordId);
            const isSelected = selectedCardId === card.id;
            const isWrong = wrongCardIds.includes(card.id);

            let btnClass = "bg-[#ffffff] border-[#e2e8f0] hover:-translate-y-0.5 hover:shadow-md hover:border-[#c0c1ff] text-[#334155]";
            if (isMatched) {
              btnClass = "bg-[#f0fff4] border-[#1d9e75] opacity-40 text-[#1d9e75] cursor-not-allowed scale-95";
            } else if (isWrong) {
              btnClass = "bg-[#fff5f5] border-[#e53e3e] text-[#e53e3e] animate-shake shadow-sm";
            } else if (isSelected) {
              btnClass = "bg-[#e1e0ff] border-[#4648d4] text-[#4648d4] scale-[1.02] shadow-md font-bold";
            }

            return (
              <button
                key={card.id}
                disabled={isMatched}
                onClick={() => handleSelectCard(card)}
                className={`border rounded-2xl p-4 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 aspect-square w-full shadow-sm ${btnClass}`}
              >
                <span className={`${card.type === 'word' ? 'font-bold' : 'font-medium'} text-[12px] sm:text-[14px] leading-tight break-all`}>
                  {card.content}
                </span>
                {isMatched && <CheckCircle className="w-4 h-4 text-[#1d9e75] shrink-0" />}
              </button>
            );
          })}
        </div>
      </main>

      {/* Styles for shake animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
          40%, 60% { transform: translate3d(3px, 0, 0); }
        }
      `}} />
    </div>
  );
}
