import express from "express";
import { chatTravelBot } from "../controllers/travelChatbot.controller.js";
import { verifyJwt } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/travel-chat", verifyJwt, chatTravelBot);

export default router;
