"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const genai_1 = require("@google/genai");
const PORT = process.env.PORT || 5000;
const ai = new genai_1.GoogleGenAI({});
// Tạo một API Endpoint để Client (hoặc Postman) có thể gọi vào
app_1.default.get("/api/chat", async (req, res) => {
    try {
        const prompt = req.query.prompt || "Hãy chào tôi bằng một câu ngắn gọn.";
        console.log(`🤖 Đang xử lý prompt: "${prompt}"...`);
        // Gọi Gemini lấy kết quả dạng text thường (cho đơn giản trước)
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
        });
        res.json({
            success: true,
            data: response.text
        });
    }
    catch (error) {
        console.error("❌ Lỗi API Gemini:", error?.message);
        res.status(500).json({
            success: false,
            error: error?.message || "Đã xảy ra lỗi hệ thống."
        });
    }
});
app_1.default.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map