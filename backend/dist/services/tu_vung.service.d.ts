export declare const layDanhSachTuVungService: (folderId: number, userId: string) => Promise<{
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
export declare const taoTuVungService: (userId: string, folderId: number, data: any) => Promise<{
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
export declare const taoNhieuTuVungService: (userId: string, folderId: number, danhSachTu: any[]) => Promise<{
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
export declare const suaTuVungService: (wordId: number, userId: string, data: any) => Promise<{
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
export declare const xoaTuVungService: (wordId: number, userId: string) => Promise<{
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
export declare const ghiNhanPhienHocService: (userId: string, folderId: number, thongTinPhien: any) => Promise<{
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
export declare const layDanhSachTuCuonChieuService: (userId: string, folderId: number, trang: number) => Promise<{
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
export declare const diChuyenTuVungService: (userId: string, wordIds: number[], targetFolderId: number) => Promise<import("@prisma/client").Prisma.BatchPayload>;
/**
 * Service: Bốc từ thông minh (Dynamic Queue)
 * Loại bỏ từ đã thuộc khỏi hàng đợi chính, gối đầu từ mới
 */
export declare const layTuThongMinhService: (userId: string, folderId: number) => Promise<{
    words: any[];
    meta: {
        dangOn: number;
        chuaHoc: number;
        moiTinh: number;
        daThuocBu: number;
    };
}>;
/**
 * Service: Lấy danh sách từ đã thuộc để ôn tập lại
 * Dùng cho chế độ "Review Mastered Words"
 */
export declare const layTuDaThuocService: (userId: string, folderId: number) => Promise<{
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
//# sourceMappingURL=tu_vung.service.d.ts.map