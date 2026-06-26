import { Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
            file?: any;
        }
    }
}
export declare const xuLyDangKy: (yeuCau: Request, phanHoi: Response) => Promise<Response<any, Record<string, any>>>;
export declare const xuLyDangNhap: (yeuCau: Request, phanHoi: Response) => Promise<Response<any, Record<string, any>>>;
export declare const xuLyDangXuat: (yeuCau: Request, phanHoi: Response) => Promise<Response<any, Record<string, any>>>;
export declare const layThongTinCaNhan: (yeuCau: Request, phanHoi: Response) => Promise<Response<any, Record<string, any>>>;
export declare const xuLyCapNhatAvatar: (yeuCau: Request, phanHoi: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=xac_thuc.controller.d.ts.map