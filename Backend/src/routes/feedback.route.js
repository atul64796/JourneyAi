import {
    createFeedback,
    getMyFeedback,
    updateFeedback,
    deleteFeedback,
} from "../controllers/feedback.controller.js";

import { verifyJwt } from "../middlewares/authmiddleware.js";

import express from "express"

const router = express.Router();

router.use(verifyJwt);

router.post("/",createFeedback)
router.post("/me",getMyFeedback)
router.patch("/:feedbackId",updateFeedback)
router.delete("/:feedbackId",deleteFeedback)

export default router;