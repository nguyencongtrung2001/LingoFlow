"use client";

import { useState, useEffect, useCallback } from "react";
import { FolderDetail, Word } from "@/types/folder";
import { ArrowLeft, Clock, Layers, CheckCircle } from "lucide-react";
import { MatchResult } from "./match-result";

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
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [originalWords, setOriginalWords] = useState<Word[]>([]);
  
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [wrongCardIds, setWrongCardIds] = useState<string[]>([]);

  const [time, setTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalPairs, setTotalPairs] = useState(0);

  const storageKey = `match_best_${folder.id}`;
  const [bestRecord, setBestRecord] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`match_best_${folder.id}`);
      return stored ? parseInt(stored, 10) : null;
    }
    return null;
  });

  const initGame = useCallback(() => {
    const shuffled = shuffleArray(folder.words).slice(0, 10); // Take up to 10 pairs
    setTotalPairs(shuffled.length);
    setOriginalWords(shuffled);

    const generatedCards: MatchCard[] = [];
    shuffled.forEach((w) => {
      generatedCards.push({ id: `w-${w.id}`, wordId: w.id, type: 'word', content: w.word });
      generatedCards.push({ id: `m-${w.id}`, wordId: w.id, type: 'meaning', content: w.meaning });
    });

    setCards(shuffleArray(generatedCards));
    setMatchedIds([]);
    setSelectedCardId(null);
    setWrongCardIds([]);
    setTime(0);
    setIsCompleted(false);
  }, [folder.words]);

  // Initialize game
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initGame();
  }, [initGame]);

  // Timer
  useEffect(() => {
    if (isCompleted || cards.length === 0) return;
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [isCompleted, cards]);

  const handleSelectCard = (card: MatchCard) => {
    if (matchedIds.includes(card.wordId)) return;
    if (selectedCardId === card.id) return;
    if (wrongCardIds.length > 0) return; // Prevent clicking while animating wrong match

    if (!selectedCardId) {
      // First card selected
      setSelectedCardId(card.id);
    } else {
      // Second card selected
      const firstCard = cards.find(c => c.id === selectedCardId);
      if (firstCard && firstCard.wordId === card.wordId && firstCard.type !== card.type) {
        // Match! (must be same wordId and different type)
        const newMatched = [...matchedIds, card.wordId];
        setMatchedIds(newMatched);
        setSelectedCardId(null);
        
        if (newMatched.length === totalPairs) {
          if (bestRecord === null || time < bestRecord) {
            setBestRecord(time);
            localStorage.setItem(storageKey, time.toString());
          }
          setTimeout(() => setIsCompleted(true), 500);
        }
      } else {
        // Wrong match
        setWrongCardIds([selectedCardId, card.id]);
        setTimeout(() => {
          setSelectedCardId(null);
          setWrongCardIds([]);
        }, 500);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (totalPairs === 0) return null;

  if (isCompleted) {
    const matchedPairs = originalWords.map(w => ({
      word: w.word,
      meaning: w.meaning,
      phonetic: w.phonetic || ""
    }));

    return (
      <MatchResult
        timeSeconds={time}
        bestRecordSeconds={bestRecord}
        averageSpeed={`${(time / totalPairs).toFixed(1)} giây / cặp`}
        matchedPairs={matchedPairs}
        onRestart={initGame}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="bg-[#f8f9ff] min-h-screen font-sans text-[#0b1c30]">
      {/* Header */}
      <header className="w-full bg-[#ffffff] border-b border-[#d3e4fe] sticky top-0 z-10 px-4 py-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[#e5eeff] transition-colors text-[#464554] flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[20px] md:text-[24px] font-bold text-[#0b1c30] truncate hidden sm:block">
            Ghép từ: {folder.name}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#e5eeff] rounded-full px-4 py-2">
            <Clock className="w-5 h-5 text-[#767586]" />
            <span className="text-[14px] font-semibold text-[#464554]">
              {formatTime(time)}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#6063ee] rounded-full px-4 py-2">
            <Layers className="w-5 h-5 text-white" />
            <span className="text-[14px] font-semibold text-white">
              Còn lại: {totalPairs - matchedIds.length}/{totalPairs}
            </span>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="max-w-[1200px] mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="text-center mb-8">
          <p className="text-[16px] md:text-[18px] text-[#464554]">
            Tìm và ghép các cặp từ vựng và nghĩa tương ứng.
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4 max-w-5xl mx-auto content-start">
          {cards.map((card) => {
            const isMatched = matchedIds.includes(card.wordId);
            const isSelected = selectedCardId === card.id;
            const isWrong = wrongCardIds.includes(card.id);

            let btnClass = "bg-[#ffffff] border-transparent shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-[#c0c1ff] text-[#0b1c30]";
            if (isMatched) {
              btnClass = "bg-[#6cf8bb] border-[#006c49] opacity-60 text-[#00714d] cursor-not-allowed scale-95";
            } else if (isWrong) {
              btnClass = "bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a] animate-[shake_0.5s_ease-in-out]";
            } else if (isSelected) {
              btnClass = "bg-[#e1e0ff] border-[#4648d4] text-[#4648d4] scale-[1.02] shadow-md";
            }

            return (
              <button
                key={card.id}
                disabled={isMatched}
                onClick={() => handleSelectCard(card)}
                className={`border-2 rounded-xl p-2 sm:p-4 text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 sm:gap-2 aspect-square w-full ${btnClass}`}
              >
                <span className={`${card.type === 'word' ? 'font-bold' : 'font-medium'} text-[11px] sm:text-[14px] md:text-[16px] wrap-break-words max-w-full leading-tight`}>
                  {card.content}
                </span>
                {isMatched && <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-[#006c49] mt-1 shrink-0" />}
              </button>
            );
          })}
        </div>
      </main>

      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}} />
    </div>
  );
}
