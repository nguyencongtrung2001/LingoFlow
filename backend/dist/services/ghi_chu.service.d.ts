export declare const layBangGhiChu: (userId: string) => Promise<({
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
export declare const taoCotMoi: (userId: string, title: string) => Promise<{
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
export declare const capNhatCot: (id: string, userId: string, title: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    position: number;
}>;
export declare const xoaCot: (id: string, userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    position: number;
}>;
export declare const taoGhiChu: (userId: string, columnId: string, title: string, content?: string | null) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    position: number;
    content: string | null;
    columnId: string;
}>;
export declare const capNhatGhiChu: (id: string, userId: string, data: {
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
export declare const xoaGhiChu: (id: string, userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    position: number;
    content: string | null;
    columnId: string;
}>;
export declare const sapXepLai: (userId: string, updates: {
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
//# sourceMappingURL=ghi_chu.service.d.ts.map