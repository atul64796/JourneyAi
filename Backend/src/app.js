import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import User from './routes/User.route.js';
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

//users api
app.use("/api/j1/v1/user", User);

// user routes


export default app;
