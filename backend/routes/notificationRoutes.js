import express from "express";
import { protectRoutes } from "../controllers/authController.js";
import {
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(protectRoutes);
router.patch("/", markAsRead);
router.delete("/", deleteNotification);

export { router as notificationRouter };
