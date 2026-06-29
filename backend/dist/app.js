"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const xac_thuc_routes_1 = __importDefault(require("./routes/xac_thuc.routes"));
const thu_muc_routes_1 = __importDefault(require("./routes/thu_muc.routes"));
const tu_vung_routes_1 = __importDefault(require("./routes/tu_vung.routes"));
const app = (0, express_1.default)();
// Cấu hình Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Cho phép truyền Cookie
}));
// Định tuyến API
app.use("/api/xac-thuc", xac_thuc_routes_1.default);
app.use("/api/thu-muc", thu_muc_routes_1.default);
app.use("/api/tu-vung", tu_vung_routes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server đang chạy mượt mà!" });
});
exports.default = app;
//# sourceMappingURL=app.js.map