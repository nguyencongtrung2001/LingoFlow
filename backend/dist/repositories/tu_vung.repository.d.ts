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
//# sourceMappingURL=tu_vung.repository.d.ts.map