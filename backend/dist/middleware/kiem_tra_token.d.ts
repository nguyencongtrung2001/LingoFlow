import { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
        }
    }
}
export declare const xacThucNguoiDung: (yeuCau: Request, phanHoi: Response, tiepTuc: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=kiem_tra_token.d.ts.map