# LingoFlow - Tài liệu Phân tích Luồng Hoạt động (FLOW.MD)

## 1. Tổng quan Công nghệ & Cấu trúc Hệ thống

* **Frontend:** Next.js, TypeScript, Tailwind CSS, Shadcn UI, Lucide Icons.
* **Backend:** ExpressJS, PostgreSQL, Neon Prisma (ORM), Google Auth, Socket.io.
* **Kiến trúc Backend:** Layered Architecture (Routing -> Controller -> Service -> Repository).
* **Thuật toán học từ thông minh :**  Weighted Queue và Leitner System.

---

## 2. Actors & Tính năng Hệ thống

### Actor 1: Người học (Learner)
1.  **Xác thực:** Đăng ký/Đăng nhập qua Google OAuth hoặc Email/Password.
2.  **Quản lý Thư mục (Folders):** Thêm, Sửa (đổi tên), Xóa các bộ từ vựng cá nhân.
3.  **Quản lý Từ vựng (Words):** Thêm/Sửa/Xóa chi tiết một từ (Từ gốc, Ý nghĩa, Phiên âm, Loại từ - POS, Ví dụ, Hình ảnh minh họa).
4.  **Học từ vựng:** Tham gia 4 chế độ ôn tập: Thẻ ghi nhớ (Flashcard), Trắc nghiệm (Quiz), Ghép đôi (Match), Gõ từ (Write/Type).

### Actor 2: Quản trị viên (Admin)
1.  **Xác thực:** Đăng nhập hệ thống qua Google Auth cấp quyền Admin.
2.  **Quản lý Người dùng (Users):** Xem danh sách toàn bộ người dùng, quản lý trạng thái tài khoản.

---

## 3. Luồng Logic Hoạt động Chi tiết (Flow Logic)

### 3.1. Luồng Điều hướng chung tại Trang Ôn tập (Study Page Router)
Khi người dùng truy cập vào một thư mục từ vựng và chọn chức năng học tập (`/folders/[slug]/study?type=...`):
1.  **Kiểm tra dữ liệu Thư mục:** Hệ thống tìm kiếm dữ liệu theo `slug` (ID thư mục). Nếu không tìm thấy, hiển thị trạng thái đang tải dữ liệu.
2.  **Xử lý thư mục rỗng (Empty State):** Nếu thư mục không có từ vựng nào (`folder.words.length === 0`), hiển thị thông báo lỗi trực quan kèm nút bấm yêu cầu người dùng quay lại trang chi tiết thư mục để thêm từ mới.
3.  **Phân phối Chế độ học:** Dựa vào Query Parameter `type` trên URL để render Component trò chơi tương ứng:
    * `type=flashcard` $\rightarrow$ Render `<FlashcardGame />`
    * `type=quiz` $\rightarrow$ Render `<QuizGame />`
    * `type=match` $\rightarrow$ Render `<MatchGame />`
    * `type=write` hoặc `type=type` $\rightarrow$ Render `<WriteGame />`
    * Nếu sai định dạng `type` $\rightarrow$ Hiển thị thông báo chế độ học không hợp lệ.

---


### 3.2. Luồng Logic Chi tiết của 4 Chế độ Học

#### Chế độ 1: Thẻ ghi nhớ (Flashcard Game)
* **Khởi tạo:** Nạp danh sách từ vựng gốc từ thư mục hiện tại. Khởi tạo mốc thời gian bắt đầu (`startTime`).
* **Trạng thái tương tác thẻ:**
    * **Chạm/Click vào Thẻ:** Kích hoạt thuộc tính hiệu ứng CSS 3D (`perspective-1000`, `rotate-y-180`) để lật qua lại giữa mặt trước (Từ gốc, phiên âm, loại từ) và mặt sau (Ý nghĩa tiếng Việt, câu ví dụ, hình ảnh).
    * **Phát âm (Text-to-Speech):** Khi click vào biểu tượng `Volume2`, hệ thống sử dụng Web Speech API (`speechSynthesis`) với cấu hình ngôn ngữ `en-US` để phát âm từ vựng mà không làm ảnh hưởng đến hành động lật thẻ.
* **Cơ chế đánh dấu thuộc bài:**
    * Người học có thể bấm nút `Heart` hoặc `CheckCircle` để đảo ngược trạng thái thuộc bài (`learned = !learned`). Trạng thái này được cập nhật trực tiếp vào mảng state giúp người dùng theo dõi tiến độ thời gian thực.
* **Điều hướng & Kết thúc:**
    * **Tiếp theo/Trước đó:** Duyệt chỉ mục `currentIndex` trong mảng, tự động reset trạng thái lật thẻ về mặt trước khi sang từ mới.
    * Khi vượt qua từ cuối cùng (`currentIndex === totalCount - 1`), ghi nhận `endTime`, tính toán tổng thời gian làm bài (giây), tỷ lệ chính xác (`accuracy = (learned / total) * 100`) và chuyển sang màn hình kết quả `<FlashcardResult />`.

#### Chế độ 2: Ghép đôi (Match Game)
* **Khởi tạo dữ liệu đặc biệt:**
    * Lấy ngẫu nhiên tối đa 10 từ trong bộ từ vựng bằng thuật toán xáo trộn dữ liệu (Fisher-Yates Shuffle).
    * Từ mảng $N$ từ gốc ban đầu, hệ thống phân tách nhân đôi thành $2N$ thẻ riêng biệt (mỗi từ sinh ra 1 thẻ `type: 'word'` và 1 thẻ `type: 'meaning'`), gán mã nhận diện duy nhất (`w-[id]` và `m-[id]`), sau đó trộn ngẫu nhiên một lần nữa trước khi hiển thị lên lưới ô vuông (Grid Layout).
* **Logic So khớp cặp thẻ (Matching Logic):**
    * **Lần chọn 1:** Lưu ID thẻ được chọn vào `selectedCardId`.
    * **Lần chọn 2:** So sánh thẻ hiện tại với thẻ đầu tiên:
        * *Nếu Khớp:* (Cùng thuộc một `wordId` gốc nhưng khác `type` dữ liệu). Đưa `wordId` vào mảng `matchedIds`. Hai thẻ này sẽ chuyển sang màu xanh lá (`#6cf8bb`), giảm độ mờ (opacity) và bị khóa tương tác.
        * *Nếu Sai:* Cả hai thẻ sẽ đổi sang màu đỏ (`#ffdad6`), kích hoạt hiệu ứng rung lắc báo lỗi trong 500ms thông qua CSS `@keyframes shake`, sau đó tự động bỏ chọn để người dùng chọn lại. Trong suốt 500ms này, hệ thống chặn toàn bộ tương tác click chuột khác để đảm bảo tính chính xác.
* **Bảng xếp hạng kỷ lục (Local Record):**
    * Đồng hồ đếm thời gian chạy liên tục mỗi giây. Khi hoàn thành tất cả các cặp thẻ, hệ thống so sánh thời gian hiện tại với kỷ lục cũ được lưu trong `localStorage` bằng khóa `match_best_[folderId]`. Nếu thời gian ngắn hơn, hệ thống sẽ cập nhật lại kỷ lục mới.

#### Chế độ 3: Trắc nghiệm (Quiz Game)
* **Khởi tạo câu hỏi:** Trộn ngẫu nhiên mảng từ vựng để tạo thứ tự câu hỏi bất ngờ.
* **Tạo bộ câu trả lời nhiễu (Distractors Generator):**
    * Với mỗi câu hỏi (Từ gốc hiện tại), hệ thống trích xuất tất cả các ý nghĩa của toàn bộ các từ có trong ứng dụng (từ tất cả thư mục), lọc bỏ ý nghĩa đúng của từ hiện tại, lấy ngẫu nhiên ra 3 ý nghĩa sai làm đáp án nhiễu.
    * Gộp đáp án đúng và 3 đáp án nhiễu lại thành mảng 4 lựa chọn, sau đó trộn ngẫu nhiên để vị trí đáp án đúng không bị cố định.
* **Xử lý phản hồi đáp án (Feedback & Streak):**
    * Khi người dùng click chọn 1 phương án: Khóa tương tác toàn bộ các nút bấm khác ngay lập tức.
    * *Nếu chọn Đúng:* Ô đáp án chuyển sang màu xanh lá, hiển thị icon check, cộng điểm chuỗi trả lời đúng (`streak = streak + 1`). Nếu chuỗi hiện tại lớn hơn chuỗi kỷ lục (`maxStreak`), cập nhật lại `maxStreak`.
    * *Nếu chọn Sai:* Ô đáp án của người dùng chọn chuyển sang màu đỏ kèm ký tự `X`, đồng thời ô đáp án đúng thực tế vẫn sẽ sáng lên màu xanh lá để định hướng kiến thức cho người học. Chuỗi trả lời đúng bị ngắt về `0`.
    * Lưu kết quả chi tiết từng câu vào mảng `history` để hiển thị báo cáo chi tiết ở màn hình kết quả `<QuizResult />`.

#### Chế độ 4: Gõ từ (Write / Type Game)
* **Khởi tạo giao diện:** Trộn ngẫu nhiên danh sách câu hỏi. Hiển thị từ gốc tiếng Anh, phiên âm, loại từ và ảnh minh họa (nếu có). Trực tiếp đưa con trỏ chuột tập trung vào ô nhập liệu (`autoFocus`).
* **Xử lý chuỗi nhập liệu (String Matching):**
    * Người dùng nhập nghĩa/từ cần điền và nhấn nút `Kiểm tra` hoặc phím `Enter`.
    * Hệ thống thực hiện chuẩn hóa chuỗi đầu vào bằng cách cắt bỏ khoảng trắng thừa ở hai đầu (`.trim()`) và chuyển đổi toàn bộ ký tự sang chữ thường (`.toLowerCase()`) để tiến hành so sánh tuyệt đối với chuỗi gốc của hệ thống.
    * *Đúng:* Tăng `streak`, tăng `correctCount`. *Sai:* Reset `streak` về 0.
    * **Chức năng Bỏ qua (Skip):** Cho phép người dùng bỏ qua câu hỏi khó, hệ thống sẽ ghi nhận câu đó có kết quả là `Sai` với chuỗi ký tự rỗng `""` trong lịch sử và ngắt chuỗi `streak`.
* **Cơ chế chuyển câu bằng phím tắt:**
    * Sử dụng sự kiện `onKeyDown`. Khi người dùng đang ở trạng thái xem kết quả đánh giá (Feedback State), chỉ cần nhấn phím `Enter`, hệ thống sẽ tự động gọi hàm `handleNext()`, xóa sạch dữ liệu ô nhập cũ, chuyển sang câu tiếp theo và tự động focus lại vào ô nhập mà không cần rê chuột bấm nút `Tiếp tục`.

---

## 4. Quy tắc Nghiệp vụ Đặc thù (Business Rules)

### Quy tắc Lặp lại thẻ học (Spaced Repetition / Card Iteration Rule)
* **Yêu cầu thiết kế:** Trong mỗi lượt chơi của bất kỳ chế độ nào, **không được lặp lại** thẻ/từ vựng mà người dùng đã học thuộc hoặc trả lời đúng trong lượt đó.
* **Giải pháp Frontend hiện tại:**
    * Mảng dữ liệu câu hỏi được xáo trộn một lần duy nhất bằng hàm `shuffleArray` khi bắt đầu trò chơi hoặc khi bấm nút `Học lại` (`handleRestart`).
    * Chỉ số `currentIndex` tịnh tiến liên tục tuần tự từ $0$ đến $totalCount - 1$. Điều này đảm bảo mỗi từ vựng chỉ xuất hiện đúng một lần duy nhất trong suốt một lượt chơi, loại bỏ hoàn toàn khả năng trùng lặp từ đã xử lý trước đó.


