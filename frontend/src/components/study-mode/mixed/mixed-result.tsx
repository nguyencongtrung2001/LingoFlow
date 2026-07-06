import { RotateCcw, ArrowLeft, Trophy, Target, Clock, Star } from "lucide-react";

export interface MixedHistoryItem {
  word: string;
  expected: string;
  userAnswer: string;
  isCorrect: boolean;
  type: "QUIZ" | "WRITE";
}

interface MixedResultProps {
  correctCount: number;
  totalCount: number;
  accuracy: number;
  maxStreak: number;
  history: MixedHistoryItem[];
  onRestart: () => void;
  onBack: () => void;
}

export function MixedResult({
  correctCount,
  totalCount,
  maxStreak,
  history,
  onRestart,
  onBack,
}: MixedResultProps) {
  const finalAccuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
  
  let resultMessage = "Tuyệt vời!";
  let resultColor = "text-[#1d9e75]";
  let resultBg = "bg-[#f0fff4]";
  let resultBorder = "border-[#bbf7d0]";

  if (finalAccuracy < 50) {
    resultMessage = "Cần cố gắng hơn!";
    resultColor = "text-[#e53e3e]";
    resultBg = "bg-[#fff5f5]";
    resultBorder = "border-[#feb2b2]";
  } else if (finalAccuracy < 80) {
    resultMessage = "Khá tốt!";
    resultColor = "text-[#b45309]";
    resultBg = "bg-[#fffbeb]";
    resultBorder = "border-[#fde68a]";
  }

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#e2e8f0]">
        
        {/* Header Kết quả */}
        <div className={`w-full flex flex-col items-center p-6 md:p-8 rounded-2xl border ${resultBorder} ${resultBg} mb-8`}>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Trophy className={`w-8 h-8 ${resultColor}`} />
          </div>
          <h2 className={`text-[28px] font-black ${resultColor} mb-2`}>
            {resultMessage}
          </h2>
          <p className="text-[16px] text-[#475569] font-medium text-center max-w-[400px]">
            Bạn đã hoàn thành phiên ôn tập hỗn hợp!
          </p>
        </div>

        {/* Thống kê (Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col items-center justify-center p-4 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">
            <Target className="w-6 h-6 text-[#4648d4] mb-2" />
            <span className="text-[13px] font-semibold text-[#64748b] mb-1">Chính xác</span>
            <span className="text-[20px] font-black text-[#0f172a]">{correctCount}/{totalCount}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">
            <div className="w-6 h-6 rounded-full bg-[#1d9e75]/20 flex items-center justify-center mb-2">
              <span className="text-[12px] font-bold text-[#1d9e75]">%</span>
            </div>
            <span className="text-[13px] font-semibold text-[#64748b] mb-1">Tỷ lệ</span>
            <span className="text-[20px] font-black text-[#0f172a]">{Math.round(finalAccuracy)}%</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">
            <Star className="w-6 h-6 text-[#b45309] fill-[#b45309] mb-2" />
            <span className="text-[13px] font-semibold text-[#64748b] mb-1">Chuỗi đúng</span>
            <span className="text-[20px] font-black text-[#0f172a]">{maxStreak}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">
            <Clock className="w-6 h-6 text-[#8b5cf6] mb-2" />
            <span className="text-[13px] font-semibold text-[#64748b] mb-1">Hoàn thành</span>
            <span className="text-[20px] font-black text-[#0f172a]">Xong</span>
          </div>
        </div>

        {/* History / Chi tiết các từ */}
        {history.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[18px] font-bold text-[#0f172a] mb-4">Chi tiết trả lời:</h3>
            <div className="flex flex-col gap-3">
              {history.map((item, idx) => (
                <div key={idx} className="flex flex-col p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[16px] text-[#0f172a]">{item.word}</span>
                    <span className={`text-[12px] font-bold px-2 py-1 rounded-lg ${
                      item.type === "QUIZ" ? "bg-[#dce9ff] text-[#4648d4]" : "bg-[#fce7f3] text-[#be185d]"
                    }`}>
                      {item.type === "QUIZ" ? "Trắc nghiệm" : "Gõ từ"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-[14px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748b] font-medium min-w-[80px]">Đáp án:</span>
                      <span className="font-semibold text-[#1d9e75]">{item.expected}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748b] font-medium min-w-[80px]">Bạn trả lời:</span>
                      <span className={`font-semibold ${item.isCorrect ? "text-[#1d9e75]" : "text-[#e53e3e]"}`}>
                        {item.userAnswer} {item.isCorrect ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <button
            onClick={onRestart}
            className="flex-1 py-4 bg-[#4648d4] hover:bg-[#6063ee] text-white rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            Ôn tập lại
          </button>
          
          <button
            onClick={onBack}
            className="flex-1 py-4 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Về thư mục
          </button>
        </div>
      </div>
    </div>
  );
}
