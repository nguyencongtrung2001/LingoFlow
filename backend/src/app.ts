import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import xacThucRoutes from "./routes/xac_thuc.routes";

const app = express();

// Cấu hình Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Cho phép truyền Cookie
  })
);

// Định tuyến API
app.use("/api/xac-thuc", xacThucRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server đang chạy mượt mà!" });
});

export default app;
