export interface SentenceError {
    position: string;
    error: string;
    suggestion: string;
}
export interface GradeResult {
    score: number;
    isCorrect: boolean;
    errors: SentenceError[];
    feedback: string;
    alternatives: string[];
}
/**
 * Chấm điểm câu tiếng Anh của học viên dựa trên từ vựng cho trước.
 * Gọi Google Gemini AI để phân tích ngữ pháp, ngữ nghĩa và trả về điểm số.
 */
export declare const chamDiemCau: (word: string, meaning: string, pos: string, sentence: string) => Promise<GradeResult>;
//# sourceMappingURL=gemini.d.ts.map