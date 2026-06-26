export declare const layDanhSachThuMucRepo: (userId: string) => Promise<({
    _count: {
        words: number;
    };
} & {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    userId: string;
})[]>;
export declare const layThuMucChiTietRepo: (id: number, userId: string) => Promise<({
    words: {
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
    }[];
} & {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    userId: string;
}) | null>;
export declare const taoThuMucRepo: (userId: string, name: string, description?: string) => Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    userId: string;
}>;
export declare const capNhatThuMucRepo: (id: number, userId: string, data: {
    name?: string;
    description?: string;
}) => Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    userId: string;
}>;
export declare const xoaThuMucRepo: (id: number, userId: string) => Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    userId: string;
}>;
//# sourceMappingURL=thu_muc.repository.d.ts.map