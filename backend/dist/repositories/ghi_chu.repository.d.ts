export declare const layBangGhiChuRepo: (userId: string) => Promise<({
    notes: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        position: number;
        content: string | null;
        columnId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    position: number;
})[]>;
export declare const taoCotMoiRepo: (userId: string, title: string, position: number) => Promise<{
    notes: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        position: number;
        content: string | null;
        columnId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    position: number;
}>;
export declare const capNhatCotRepo: (id: string, title: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    position: number;
}>;
export declare const xoaCotRepo: (id: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    position: number;
}>;
export declare const timCotTheoIdRepo: (id: string) => Promise<{
    id: string;
    userId: string;
} | null>;
export declare const layPositionCotLonNhatRepo: (userId: string) => Promise<number>;
export declare const taoGhiChuRepo: (columnId: string, title: string, content: string | null, position: number) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    position: number;
    content: string | null;
    columnId: string;
}>;
export declare const capNhatGhiChuRepo: (id: string, data: {
    title?: string;
    content?: string | null;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    position: number;
    content: string | null;
    columnId: string;
}>;
export declare const xoaGhiChuRepo: (id: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    position: number;
    content: string | null;
    columnId: string;
}>;
export declare const timGhiChuTheoIdRepo: (id: string) => Promise<({
    column: {
        userId: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    position: number;
    content: string | null;
    columnId: string;
}) | null>;
export declare const layPositionGhiChuLonNhatRepo: (columnId: string) => Promise<number>;
export declare const sapXepLaiRepo: (updates: {
    id: string;
    position: number;
    columnId: string;
}[]) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    position: number;
    content: string | null;
    columnId: string;
}[]>;
//# sourceMappingURL=ghi_chu.repository.d.ts.map