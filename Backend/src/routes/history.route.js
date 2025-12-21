import express from "express";
import {
  getUserHistory,
  deleteHistory,
  createHistory
} from "../controllers/history.controller.js";
import { verifyJwt } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.use(verifyJwt);
router.post("/" ,createHistory);
router.get("/", getUserHistory);
router.delete("/:id", deleteHistory);

export default router;
