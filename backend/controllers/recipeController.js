import AppError from "../utils/appError.js";
import db from "./../database/firestore.js";

const createRecipe = async (req, res, next) => {
  try {
    const {
      name,
      author,
      date,
      picture,
      category,
      preparation_time,
      no_servings,
      calories,
      tags,
      ingredients,
      preparation_method,
    } = req.body;
    if (
      !name ||
      !author ||
      !author.email ||
      !author.id ||
      !date ||
      !ingredients ||
      !preparation_method
    ) {
      throw new AppError("Complete all required fields!", 400);
    } else if (!Array.isArray(ingredients)) {
      throw new AppError("Ingredients should be an array!", 400);
    }
    const user = await db.collection("Users").doc(author.id).get();
    if (!user.exists) {
      throw new AppError("Invalid user!", 400);
    } else if (user.data().email !== author.email) {
      throw new AppError("Email is not associated with this id!", 400);
    }
    const recipeRef = db.collection("Recipes");
    const newRecipe = {
      name,
      author,
      date,
      ingredients,
      preparation_method,
    };
    if (picture) {
      newRecipe["picture"] = picture;
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
      newRecipe["tags"] = tags;
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

const getAllRecipes = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError("User id must be provided!", 400);
    }
    const userRef = db.collection("Users").doc(userId);
    const user = await userRef.get();
    if (!user.exists) {
      throw new AppError("No user with such id", 400);
    } else {
      const userData = user.data();
      userData["password"] = undefined;
      res.json({ status: "success", userData });
    }
  } catch (err) {
    next(err);
  }
};

export { createRecipe, getAllRecipes };
