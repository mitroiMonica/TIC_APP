import AppError from "../utils/appError.js";
import db from "./../database/firestore.js";

const getAllRecipes = async (req, res, next) => {
  try {
    const recipeRef = db.collection("Recipes");
    let recipesSnapshot;
    if (req.query.userId) {
      recipesSnapshot = await recipeRef
        .where("author.id", "!=", req.query.userId)
        .get();
    } else {
      recipesSnapshot = await recipeRef.get();
    }
    if (recipesSnapshot.empty) {
      throw new AppError("No recipes", 400);
    }
    const recipes = [];
    let userFavoritesRecipes = undefined;
    if (req.query.userId) {
      const userRef = db.collection("Users").doc(req.query.userId);
      const user = await userRef.get();
      if (user.exists) {
        userFavoritesRecipes = user.data().favorites;
      }
    }
    recipesSnapshot.forEach((recipe) => {
      const newRecipe = {
        id: recipe.id,
        ...recipe.data(),
      };
      if (userFavoritesRecipes && userFavoritesRecipes.length !== 0) {
        if (userFavoritesRecipes.includes(newRecipe.id)) {
          newRecipe["isFavorite"] = true;
        }
      }
      recipes.push(newRecipe);
    });
    res.json({
      status: "success",
      noRecipes: recipes.length,
      recipes,
    });
  } catch (err) {
    next(err);
  }
};

const createRecipe = async (req, res, next) => {
  try {
    const {
      name,
      category,
      preparation_time,
      no_servings,
      calories,
      tags,
      ingredients,
      preparation_method,
    } = req.body;
    if (!name || !ingredients || !preparation_method) {
      throw new AppError("Complete all required fields!", 400);
    }
    const user = await db.collection("Users").doc(req.userId).get();
    if (!user.exists) {
      throw new AppError("Invalid user!", 400);
    }
    const recipeRef = db.collection("Recipes");
    const newRecipe = {
      name,
      author: {
        id: req.userId,
        email: user.data().email,
      },
      date: Date.now(),
      ingredients: ingredients.split(/[,\n]+/).map((i) => i.trim()),
      preparation_method,
    };
    if (req.file) {
      newRecipe["picture"] = req.file.filename;
    }
    if (category) {
      newRecipe["category"] = category;
    }
    if (preparation_time) {
      newRecipe["preparation_time"] = preparation_time;
    }
    if (no_servings) {
      newRecipe["no_servings"] = no_servings;
    }
    if (calories) {
      newRecipe["calories"] = calories;
    }
    if (tags) {
      newRecipe["tags"] = tags.split(/[,\s\n]+/);
    }
    await recipeRef.add(newRecipe);
    res.status(201).json({
      status: "success",
      message: "Recipe successfully added",
      recipe: newRecipe,
    });
  } catch (err) {
    next(err);
  }
};

const getUserRecipes = async (req, res, next) => {
  try {
    const recipeRef = db.collection("Recipes");
    const recipesSnapshot = await recipeRef
      .where("author.id", "==", req.params.id)
      .get();
    const userRecipes = [];
    recipesSnapshot.forEach((recipe) => {
      const newRecipe = {
        id: recipe.id,
        ...recipe.data(),
      };
      userRecipes.push(newRecipe);
    });
    res.json({
      status: "success",
      noRecipes: userRecipes.length,
      recipes: userRecipes,
    });
  } catch (err) {
    next(err);
  }
};

export { createRecipe, getAllRecipes, getUserRecipes };
