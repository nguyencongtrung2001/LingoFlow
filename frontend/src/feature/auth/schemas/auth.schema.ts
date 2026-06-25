import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Địa chỉ email không hợp lệ." }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống." }),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Họ và tên phải có ít nhất 2 ký tự." }),
  email: z.string().email({ message: "Địa chỉ email không hợp lệ." }),
  password: z
    .string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự." })
    .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa." })
    .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ số." }),
  terms: z.literal(true, {
    error: "Bạn phải đồng ý với điều khoản dịch vụ.",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;