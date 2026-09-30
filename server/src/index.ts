import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { config } from "./config/index.js";
import apiRoutes from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure upload directory exists
const uploadPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(uploadPath));

// API routes
app.use("/api", apiRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    service: "TRIBAL SAKSHAM AI Server",
    version: "1.0.0",
    aiMode: config.aiMode,
    timestamp: new Date().toISOString()
  });
});

// Global 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ success: false, message: "Internal server error occurred" });
});

app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🏛️  TRIBAL SAKSHAM AI — Backend Server`);
  console.log(`📍 Port: http://localhost:${config.port}`);
  console.log(`🤖 AI Engine Mode: ${config.aiMode.toUpperCase()}`);
  console.log(`🔒 Data Safety: Verified Official / Demo Badge Enforced`);
  console.log(`====================================================`);
});
