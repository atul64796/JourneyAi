import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import User from './routes/User.route.js';

const app = express();

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

export default app;
