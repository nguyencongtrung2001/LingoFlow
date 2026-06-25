Công nghệ sử dụng : 
    Frontend : Nextjs , TypeScript , Tailwindcss , Shadcn
    Backend : ExpressJS , PostgresSQL , Neon Prisma, GoogleAuth. Socket.io

Cấu trúc backend: 
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── config/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── logs/
├── scripts/
└── package.json


Actor :  người học , quản trị viên

tính năng của người dùng ( người học):
     1. Đăng nhập/Đăng ký: Xác thực người dùng qua Google Auth hoặc emai , password .
     2. Quản lý Từ điển (Folders): Tạo, đổi tên, xóa thư mục chứa từ vựng.
     3. Quản lý Từ vựng (Words): Thêm/Sửa/Xóa từ (bao gồm  từ , nghĩa , phiên âm , loại từ , ví dụ , hình ảnh ).
     4. Học từ vựng: Các chế độ học như Trắc nghiệm, Ghép đôi, Điền từ, Flashcard.


quản trị viên : 
    1. Đăng nhập/Đăng ký: Xác thực quản trị viên qua Google Auth.
    2. Quản lý Người dùng (Users): Xem danh sách người dùng và thông tin của họ.

Luồng logic hoạt động: 







mỗi trò chơi số lần lặp lại các thẻ  : 
    không được lặp lại thẻ đã học thuộc 