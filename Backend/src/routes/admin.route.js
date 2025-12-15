import express from "express";
import { verifyJwt } from "../middlewares/authmiddleware.js";
import { adminOnly } from "../middlewares/adminOnly.middleware.js";

import {
  getAllUsers,
  toggleUserBan,
  toggleAccountStatus,
} from "../controllers/user.controllers.js";

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

export default router;
