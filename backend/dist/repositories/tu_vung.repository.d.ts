import { StudyMode } from "@prisma/client";
export declare const layDanhSachTuVungRepo: (folderId: number) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    word: string;
    meaning: string;
    phonetic: string | null;
    pos: import("@prisma/client").$Enums.PartOfSpeech;
    example: string | null;
    image: string | null;
    folderId: number;
}[]>;
export declare const taoTuVungRepo: (userId: string, folderId: number, data: any) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    word: string;
    meaning: string;
    phonetic: string | null;
    pos: import("@prisma/client").$Enums.PartOfSpeech;
    example: string | null;
    image: string | null;
    folderId: number;
}>;
export declare const taoNhieuTuVungRepo: (userId: string, folderId: number, danhSachTu: any[]) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    word: string;
    meaning: string;
    phonetic: string | null;
    pos: import("@prisma/client").$Enums.PartOfSpeech;
    example: string | null;
    image: string | null;
    folderId: number;
}[]>;
export declare const suaTuVungRepo: (wordId: number, data: any) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    word: string;
    meaning: string;
    phonetic: string | null;
    pos: import("@prisma/client").$Enums.PartOfSpeech;
    example: string | null;
    image: string | null;
    folderId: number;
}>;
export declare const xoaTuVungRepo: (wordId: number) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    word: string;
    meaning: string;
    phonetic: string | null;
    pos: import("@prisma/client").$Enums.PartOfSpeech;
    example: string | null;
    image: string | null;
    folderId: number;
}>;
export declare const taoPhienHocRepo: (maNguoiDung: string, folderId: number, thongTinPhien: {
    mode: StudyMode;
    totalWords: number;
    correctCount: number;
    accuracy: number;
    timeSeconds: number;
    maxStreak: number;
    details: Array<{
        wordId: number;
        isCorrect: boolean;
        userAnswer?: string;
        expectedAnswer?: string;
    }>;
}) => Promise<{
    id: string;
    userId: string;
    folderId: number;
    mode: import("@prisma/client").$Enums.StudyMode;
    totalWords: number;
    correctCount: number;
    accuracy: number;
    maxStreak: number;
    timeSeconds: number | null;
    bestRecord: boolean;
    startedAt: Date;
    completedAt: Date;
}>;
export declare const layDanhSachTuCuonChieuRepo: (folderId: number, trang: number) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    word: string;
    meaning: string;
    phonetic: string | null;
    pos: import("@prisma/client").$Enums.PartOfSpeech;
    example: string | null;
    image: string | null;
    folderId: number;
}[]>;
export declare const diChuyenTuVungRepo: (wordIds: number[], targetFolderId: number) => Promise<import("@prisma/client").Prisma.BatchPayload>;
/**
 * Thuật toán Hàng đợi Động (Dynamic Queue) — Bốc từ thông minh
 *
 * Quy trình:
 * 1. Lấy các từ ĐANG ÔN (box 1-4) — ưu tiên trả về trước
 * 2. Tính slot còn trống = limit - số từ đang ôn
 * 3. Lấp đầy slot trống bằng từ MỚI TINH (chưa có WordProgress)
 * 4. Nếu vẫn chưa đủ, lấy thêm từ đã thuộc (box 5) để bù
 */
export declare const layTuThongMinhRepo: (userId: string, folderId: number, limit?: number) => Promise<{
    words: any[];
    meta: {
        dangOn: number;
        moiTinh: number;
        daThuocBu: number;
    };
}>;
/**
 * Lấy danh sách từ ĐÃ THUỘC (box === 5) để ôn tập lại
 * Dùng cho chế độ "Ôn tập từ đã thuộc" (Review Mastered Words)
 */
export declare const layTuDaThuocRepo: (userId: string, folderId: number) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    word: string;
    meaning: string;
    phonetic: string | null;
    pos: import("@prisma/client").$Enums.PartOfSpeech;
    example: string | null;
    image: string | null;
    folderId: number;
}[]>;
//# sourceMappingURL=tu_vung.repository.d.ts.map