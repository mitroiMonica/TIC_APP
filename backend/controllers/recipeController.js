import AppError from "../utils/appError.js";
import db from "./../database/firestore.js";

const getAllRecipes = async (req, res, next) => {
  try {
    const recipeRef = db.collection("Recipes");
    let recipesSnapshot = await recipeRef.orderBy("date", "desc").get();
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
      if (req.query.userId && recipe.data().author.id === req.query.userId) {
        return;
      }
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
    newRecipe["no_likes"] = 0;
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
      // .where("author.id", "==", req.params.id)
      // limitare Firebase - where si orderBy trebuie facute pe acelasi camp
      .orderBy("date", "desc")
      .get();
    let favorites;
    if (req.query.loggedUserId) {
      const userRef = db.collection("Users").doc(req.query.loggedUserId);
      const user = await userRef.get();
      if (!user.empty) {
        favorites = user.data().favorites;
      }
    }
    const userRecipes = [];
    recipesSnapshot.forEach((recipe) => {
      if (recipe.data().author.id !== req.params.id) {
        return;
      }
      const newRecipe = {
        id: recipe.id,
        ...recipe.data(),
      };
      if (favorites && favorites.length !== 0) {
        if (favorites.includes(newRecipe.id)) {
          newRecipe["isFavorite"] = true;
        }
      }
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

const deleteRecipe = async (req, res, next) => {
  try {
    if (!req.body.recipeId) {
      throw new AppError("Recipe id must be provided");
    }
    const recipeRef = db.collection("Recipes").doc(req.body.recipeId);
    const recipe = await recipeRef.get();
    if (!recipe.exists) {
      throw new AppError("Invalid recipe!");
    }
    if (recipe.data().author.id !== req.userId) {
      throw new AppError("You can only delete your own recipes");
    }
    await recipeRef.delete();
    res.json({
      status: "success",
      message: "Recipe successfully deleted",
    });
  } catch (err) {
    next(err);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    if (!req.body.recipeId) {
      throw new AppError("Recipe id must be provided");
    }
    const recipeRef = db.collection("Recipes").doc(req.body.recipeId);
    const recipe = await recipeRef.get();
    if (!recipe.exists) {
      throw new AppError("Invalid recipe!");
    }
    if (recipe.data().author.id !== req.userId) {
      throw new AppError("You can only update your own recipes");
    }
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
    const recipeUpdated = {
      name,
      author: {
        ...recipe.data().author,
      },
      date: recipe.data().date,
      ingredients: ingredients
        .split(/,|\n/)
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      preparation_method,
      no_likes: recipe.data().no_likes,
    };
    if (req.file) {
      recipeUpdated["picture"] = req.file.filename;
    } else if (recipe.data().picture) {
      recipeUpdated["picture"] = recipe.data().picture;
    }
    if (category) {
      recipeUpdated["category"] = category;
    }
    if (preparation_time) {
      recipeUpdated["preparation_time"] = preparation_time;
    }
    if (no_servings) {
      recipeUpdated["no_servings"] = no_servings;
    }
    if (calories) {
      recipeUpdated["calories"] = calories;
    }
    if (tags) {
      recipeUpdated["tags"] = tags
        .split(/,|\n/)
        .map((item) => item.trim())
        .filter((item) => item !== "");
    }
    await recipeRef.set(recipeUpdated);
    res.json({
      status: "success",
      message: "Recipe successfully updated",
      recipe: recipeUpdated,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createRecipe,
  getAllRecipes,
  getUserRecipes,
  deleteRecipe,
  updateRecipe,
};
