export declare const timNguoiDungTheoEmail: (email: string) => Promise<{
    id: string;
    email: string;
    googleId: string | null;
    name: string;
    avatar: string | null;
    assetUrl: string | null;
    role: import("@prisma/client").$Enums.Role;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const timNguoiDungTheoId: (id: string) => Promise<{
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: import("@prisma/client").$Enums.Role;
    createdAt: Date;
} | null>;
export declare const taoNguoiDungMoi: (thongTinNguoiDung: any) => Promise<{
    id: string;
    email: string;
    googleId: string | null;
    name: string;
    avatar: string | null;
    assetUrl: string | null;
    role: import("@prisma/client").$Enums.Role;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const capNhatAvatarNguoiDung: (id: string, urlAnh: string) => Promise<{
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: import("@prisma/client").$Enums.Role;
}>;
//# sourceMappingURL=xac_thuc.repository.d.ts.map