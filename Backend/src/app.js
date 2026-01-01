import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

/* ===== ROUTES ===== */
import User from "./routes/User.route.js";
import storyRoutes from "./routes/Story.route.js";
import adminRoutes from "./routes/admin.route.js";
import feedbackRoute from "./routes/feedback.route.js";
import historyRoutes from "./routes/history.route.js";
import travelChatbotRoutes from "./routes/travelChatbot.routes.js";
import ttsRoute from "./routes/tts.route.js";

dotenv.config();
const app = express();

/* ===================== BODY PARSERS ===================== */
/* ⚠️ MUST BE BEFORE ROUTES */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

/* ===================== STATIC FILES ===================== */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ===================== CORS (PRODUCTION SAFE) ===================== */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim())
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://journey-ai-delta.vercel.app",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, mobile apps, SSR
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight support (VERY IMPORTANT)
app.options(/.*/, cors());

/* ===================== HEALTH CHECK ===================== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Journey AI Backend is running 🚀",
  });
});


/* ===================== API ROUTES ===================== */
app.use("/j1/v1/user", User);
app.use("/j1/v1/stories", storyRoutes);
app.use("/j1/v1/feedback", feedbackRoute);
app.use("/j1/v1/history", historyRoutes);
app.use("/j1/v1/admin", adminRoutes);
app.use("/j1/v1/chat", travelChatbotRoutes);
app.use("/j1/v1/tts", ttsRoute);

/* ===================== 404 HANDLER ===================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

export default app;
