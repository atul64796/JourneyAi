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

/* ===================== CORS (SAFE FOR EXPRESS 5) ===================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://journey-ai-delta.vercel.app",
];



app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://journey-ai-delta.vercel.app",
      ];

      // allow requests with no origin (Postman, SSR, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


/* ===================== BODY PARSERS ===================== */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

/* ===================== STATIC ===================== */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ===================== HEALTH ===================== */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Journey AI Backend running 🚀",
  });
});

/* ===================== ROUTES ===================== */
app.use("/j1/v1/user", User);
app.use("/j1/v1/stories", storyRoutes);
app.use("/j1/v1/feedback", feedbackRoute);
app.use("/j1/v1/history", historyRoutes);
app.use("/j1/v1/admin", adminRoutes);
app.use("/j1/v1/chat", travelChatbotRoutes);
app.use("/j1/v1/tts", ttsRoute);

/* ===================== 404 ===================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

export default app;
