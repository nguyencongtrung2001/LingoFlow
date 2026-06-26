export declare const layDanhSachThuMuc: (userId: string) => Promise<({
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
export declare const layThuMucChiTiet: (id: number, userId: string) => Promise<{
    words: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        word: string;
        meaning: string;
        phonetic: string | null;
        pos: import(".prisma/client").$Enums.PartOfSpeech;
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
}>;
export declare const taoThuMuc: (userId: string, name: string, description?: string) => Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    userId: string;
}>;
export declare const capNhatThuMuc: (id: number, userId: string, data: {
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
export declare const xoaThuMuc: (id: number, userId: string) => Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    userId: string;
}>;
//# sourceMappingURL=thu_muc.service.d.ts.map