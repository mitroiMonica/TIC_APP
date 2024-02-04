import express from "express";
import {
  createFakeComments,
  createFakeRecipes,
  createFakeUsers,
  setFavoritesRecipes,
} from "./../controllers/fakerController.js";

const router = express.Router();

router.post("/users", createFakeUsers);
router.post("/recipes", createFakeRecipes);
router.post("/comments", createFakeComments);
router.patch("/users", setFavoritesRecipes);

export { router as fakerRouter };
