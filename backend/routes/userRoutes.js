import express from "express";
import {
  login,
  protectRoutes,
  register,
} from "./../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(protectRoutes);
router.get("/", async (req, res, next) => {
  res.status(200).json({ da: "DA" });
});

export { router as userRouter };
