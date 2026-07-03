import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import xacThucRoutes from "./routes/xac_thuc.routes";
import thuMucRoutes from "./routes/thu_muc.routes";
import tuVungRoutes from "./routes/tu_vung.routes";
import thongKeRoutes from "./routes/thong_ke.routes";
import quanTriRoutes from "./routes/quan_tri.routes";
import ghiChuRoutes from "./routes/ghi_chu.routes";

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
app.use("/api/thu-muc", thuMucRoutes);
app.use("/api/tu-vung", tuVungRoutes);
app.use("/api/thong-ke", thongKeRoutes);
app.use("/api/quan-tri", quanTriRoutes);
app.use("/api/ghi-chu", ghiChuRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server đang chạy mượt mà!" });
});

export default app;
