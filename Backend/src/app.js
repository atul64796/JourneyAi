import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import User from './routes/User.route.js';
import dotenv from "dotenv";
import storyRoutes from "./routes/Gemni.route.js"
import adminRoutes from "./routes/admin.route.js";
import path from "path";




dotenv.config();

const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// serve uploaded images publicly
app.use(express.static("public"));

// test route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// user routes
app.use("/j1/v1/user", User);

//gemni route
app.use("/j1/v1/stories",storyRoutes)

//admin
app.use("/j1/v1/admin",adminRoutes)

export default app;
