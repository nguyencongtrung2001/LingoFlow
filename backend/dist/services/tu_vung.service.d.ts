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
//# sourceMappingURL=tu_vung.service.d.ts.map