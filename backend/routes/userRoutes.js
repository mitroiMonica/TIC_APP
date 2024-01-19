import express from "express";
import {
  login,
  protectRoutes,
  register,
} from "./../controllers/authController.js";
import { getUserData, updateUser } from "./../controllers/userController.js";
import {
  resizeUserPhoto,
  updateMiddleware,
} from "./../controllers/photoController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getUserData);

router.use(protectRoutes);

router.patch("/updatePhoto", updateMiddleware, resizeUserPhoto, updateUser);

export { router as userRouter };
