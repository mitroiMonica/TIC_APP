import express from "express";
import { protectRoutes } from "../controllers/authController.js";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.use(protectRoutes);
router.post("/", createComment);
router.delete("/", deleteComment);
router.patch("/", updateComment);

export { router as commentRouter };
