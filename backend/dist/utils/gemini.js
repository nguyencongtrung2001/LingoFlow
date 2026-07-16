"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chamDiemCau = void 0;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({});
/**
 * Chấm điểm câu tiếng Anh của học viên dựa trên từ vựng cho trước.
 * Gọi Google Gemini AI để phân tích ngữ pháp, ngữ nghĩa và trả về điểm số.
 */
const chamDiemCau = async (word, meaning, pos, sentence) => {
    const prompt = `Bạn là giáo viên tiếng Anh chuyên nghiệp. Hãy chấm câu của học viên theo từ vựng cho trước.

Từ vựng: "${word}" (${pos || "word"}) - Nghĩa: "${meaning}"
Câu của học viên: "${sentence}"

Yêu cầu chấm điểm:
- Câu có sử dụng đúng từ "${word}" không?
- Ngữ pháp có đúng không?
- Ngữ nghĩa có hợp lý không?
- Câu có tự nhiên không?

Trả về ĐÚNG JSON hợp lệ (không thêm bất kỳ text nào ngoài JSON, KHÔNG dùng markdown code block):
{
  "score": <số nguyên 0-100>,
  "isCorrect": <true nếu score > 60, false nếu không>,
  "errors": [
    {
      "position": "<vị trí hoặc loại lỗi, ví dụ: động từ, mạo từ, chính tả>",
      "error": "<mô tả lỗi bằng tiếng Việt>",
      "suggestion": "<cách sửa bằng tiếng Việt>"
    }
  ],
  "feedback": "<nhận xét tổng quan bằng tiếng Việt, 1-2 câu ngắn gọn>",
  "alternatives": [
    "<câu mẫu hoàn hảo 1 sử dụng từ ${word}>",
    "<câu mẫu hoàn hảo 2 sử dụng từ ${word}>"
  ]
}`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        const rawText = response.text?.trim() || "";
        // Loại bỏ markdown code block nếu AI trả về dạng ```json ... ```
        const cleanedText = rawText
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
        const result = JSON.parse(cleanedText);
        // Đảm bảo isCorrect đồng bộ với score
        result.isCorrect = result.score > 60;
        // Validation cơ bản
        if (typeof result.score !== "number")
            result.score = 0;
        if (!Array.isArray(result.errors))
            result.errors = [];
        if (typeof result.feedback !== "string")
            result.feedback = "Không có nhận xét.";
        if (!Array.isArray(result.alternatives))
            result.alternatives = [];
        return result;
    }
    catch (error) {
        // Fallback nếu gọi AI lỗi hoặc JSON không hợp lệ
        console.error("❌ Lỗi gọi Gemini AI hoặc parse JSON:", error?.message);
        return {
            score: 0,
            isCorrect: false,
            errors: [],
            feedback: "Hệ thống AI tạm thời không thể chấm điểm. Vui lòng thử lại sau.",
            alternatives: [],
        };
    }
};
exports.chamDiemCau = chamDiemCau;
//# sourceMappingURL=gemini.js.map