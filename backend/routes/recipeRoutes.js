import express from "express";
import { protectRoutes } from "../controllers/authController.js";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getUserRecipes,
} from "../controllers/recipeController.js";
import {
  resizeUserPhoto,
  updateMiddleware,
} from "./../controllers/photoController.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/user/:id", getUserRecipes);

router.use(protectRoutes);
router.post("/", updateMiddleware, resizeUserPhoto, createRecipe);
router.delete("/", deleteRecipe);

export { router as recipeRouter };
