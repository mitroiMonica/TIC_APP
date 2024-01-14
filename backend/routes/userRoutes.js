import express from "express";
import {
  login,
  protectRoutes,
  register,
} from "./../controllers/authController.js";
import { getUserData } from "./../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getUserData);

router.use(protectRoutes);

export { router as userRouter };
