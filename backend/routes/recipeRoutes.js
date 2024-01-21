import express from "express";
import { protectRoutes } from "../controllers/authController.js";
import {
  createRecipe,
  getAllRecipes,
} from "../controllers/recipeController.js";
import {
  resizeUserPhoto,
  updateMiddleware,
} from "./../controllers/photoController.js";

const router = express.Router();

router.get("/", getAllRecipes);

router.use(protectRoutes);
router.post("/", updateMiddleware, resizeUserPhoto, createRecipe);

export { router as recipeRouter };
