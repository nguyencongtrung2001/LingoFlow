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
    useWord: string | null;
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
    useWord: string | null;
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
    useWord: string | null;
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
    useWord: string | null;
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
    useWord: string | null;
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
    useWord: string | null;
    image: string | null;
    folderId: number;
}[]>;
export declare const diChuyenTuVungRepo: (wordIds: number[], targetFolderId: number) => Promise<import("@prisma/client").Prisma.BatchPayload>;
/**
 * Thuật toán Hàng đợi Động (Dynamic Queue) — Bốc từ thông minh
 *
 * Corrects-based Mastery:
 *   - corrects 0, attempts 0: Chưa học (chưa từng ôn)
 *   - corrects 1-6 (attempts > 0): Đang ôn (đã bắt đầu học, chưa thuộc)
 *   - corrects >= 7: Đã thuộc (loại khỏi queue chính)
 *
 * Quy trình (FIX: Ưu tiên tuyệt đối từ đang ôn):
 * 1. Lấy từ ĐANG ÔN (attempts > 0, corrects < 7) — ĐÂY LÀ ƯU TIÊN SỐ 1
 * 2. Nếu chưa đủ 15, lấp bằng từ CHƯA HỌC (attempts = 0, corrects = 0)
 * 3. Nếu chưa đủ, lấy từ MỚI TINH (chưa có WordProgress)
 * 4. Nếu vẫn chưa đủ, lấy từ ĐÃ THUỘC (corrects >= 7) để bù
 */
export declare const layTuThongMinhRepo: (userId: string, folderId: number, limit?: number) => Promise<{
    words: any[];
    meta: {
        dangOn: number;
        chuaHoc: number;
        moiTinh: number;
        daThuocBu: number;
    };
}>;
/**
 * Lấy danh sách từ ĐÃ THUỘC (corrects >= 7) để ôn tập lại
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
    useWord: string | null;
    image: string | null;
    folderId: number;
}[]>;
/**
 * Lấy thống kê tiến độ cho một thư mục:
 *   - daThuoc: corrects >= 7
 *   - dangOn: attempts > 0 AND corrects < 7
 *   - chuaHoc: attempts = 0 (hoặc chưa có WordProgress)
 */
export declare const layTienDoThuMucRepo: (userId: string, folderId: number) => Promise<{
    tongSoTu: number;
    daThuoc: number;
    dangOn: number;
    chuaHoc: number;
}>;
//# sourceMappingURL=tu_vung.repository.d.ts.map