export declare const layDanhSachNguoiDungWithStats: () => Promise<{
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: import("@prisma/client").$Enums.Role;
    isActive: boolean;
    createdAt: Date;
    folders: {
        _count: {
            words: number;
        };
    }[];
    activities: {
        studyTimeSeconds: number;
    }[];
    _count: {
        folders: number;
        studySessions: number;
    };
}[]>;
export declare const capNhatVaiTroNguoiDung: (id: string, role: "LEARNER" | "ADMIN") => Promise<{
    id: string;
    email: string;
    name: string;
    role: import("@prisma/client").$Enums.Role;
}>;
export declare const capNhatTrangThaiNguoiDung: (id: string, isActive: boolean) => Promise<{
    id: string;
    email: string;
    name: string;
    isActive: boolean;
}>;
//# sourceMappingURL=quan_tri.repository.d.ts.map