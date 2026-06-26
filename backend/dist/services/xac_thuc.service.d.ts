export declare const taoTheXacThuc: (maNguoiDung: string, vaiTro: string) => string;
export declare const taoTaiKhoanMoi: (thongTin: {
    email: string;
    matKhau: string;
    hoTen: string;
}) => Promise<{
    id: string;
    email: string;
    googleId: string | null;
    name: string;
    avatar: string | null;
    assetUrl: string | null;
    role: import(".prisma/client").$Enums.Role;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const kiemTraDangNhap: (email: string, matKhau: string) => Promise<{
    id: string;
    email: string;
    googleId: string | null;
    name: string;
    avatar: string | null;
    assetUrl: string | null;
    role: import(".prisma/client").$Enums.Role;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const layDuLieuNguoiDung: (maNguoiDung: string) => Promise<{
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: import(".prisma/client").$Enums.Role;
    createdAt: Date;
}>;
export declare const capNhatAnhDaiDien: (maNguoiDung: string, urlAnh: string) => Promise<{
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: import(".prisma/client").$Enums.Role;
}>;
//# sourceMappingURL=xac_thuc.service.d.ts.map