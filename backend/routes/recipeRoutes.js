import express from "express";
import { protectRoutes } from "../controllers/authController.js";
import {
  createRecipe,
  getAllRecipes,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/", getAllRecipes);

router.use(protectRoutes);
router.post("/", createRecipe);

export { router as recipeRouter };
