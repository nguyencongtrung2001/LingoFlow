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
//# sourceMappingURL=tu_vung.repository.d.ts.map