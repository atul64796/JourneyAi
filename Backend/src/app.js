import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//Routes For User,admin,review,bookmarks,skill




const app = express();






// middleware
app.use(cors({
    origin: process.env.Cors_origin || "http://localhost:5173",
    credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// user routes


export default app;
