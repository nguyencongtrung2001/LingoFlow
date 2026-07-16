import "dotenv/config";
import app from "./app";
import { GoogleGenAI } from "@google/genai";

const PORT = process.env.PORT || 5000;
const ai = new GoogleGenAI({});

// Tạo một API Endpoint để Client (hoặc Postman) có thể gọi vào
app.get("/api/chat", async (req, res) => {
  try {
    const prompt = (req.query.prompt as string) || "Hãy chào tôi bằng một câu ngắn gọn.";

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

  } catch (error: any) {
    console.error("❌ Lỗi API Gemini:", error?.message);
    res.status(500).json({
      success: false,
      error: error?.message || "Đã xảy ra lỗi hệ thống."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});