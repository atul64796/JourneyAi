import express from "express";
import { verifyJwt } from "../middlewares/authmiddleware.js";
import { adminOnly } from "../middlewares/adminOnly.middleware.js";

import {
  getAllUsers,
  toggleUserBan,
  toggleAccountStatus,
} from "../controllers/user.controller.js";

import { getAllFeedback,
  respondToFeedback,
  adminDeleteFeedback
 } from "../controllers/feedback.controller.js";

const router = express.Router();

router.use(verifyJwt, adminOnly);

router.get("/me", (req, res) => {
  res.json({
    success: true,
    admin: req.user,
  });
});

router.get("/users", getAllUsers);
router.patch("/users/:userId/ban", toggleUserBan);
router.patch("/users/:userId/status", toggleAccountStatus);

//feedbacks routes for admin
router.get("/feedback",getAllFeedback);
router.patch("/feedback/:feedbackId/respond",respondToFeedback);
router.delete("/feedback/:feedbackId", adminDeleteFeedback);

export default router;
