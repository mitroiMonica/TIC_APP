import AppError from "../utils/appError.js";
import db from "./../database/firestore.js";

const getUserData = async (req, res, next) => {
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

const updateUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const userRef = db.collection("Users").doc(userId);
    if (req.file) {
      await userRef.update({
        photo: req.file.filename,
      });
    } else {
      throw new AppError("No file attached", 400);
    }
    res.json({
      status: "success",
      message: "Photo successfully updated!",
      filename: req.file.filename,
    });
  } catch (err) {
    next(err);
  }
};

const changeFavoriteRecipes = async (req, res, next) => {
  try {
    if (req.body.recipeId) {
      const recipeRef = db.collection("Recipes").doc(req.body.recipeId);
      const recipe = await recipeRef.get();
      if (!recipe.exists) {
        throw new AppError("Incorrect recipe!", 400);
      } else if (recipe.data().author.id === req.userId) {
        throw new AppError("You cannot like your own recipe!");
      }
      const userRef = db.collection("Users").doc(req.userId);
      const user = await userRef.get();
      let favorites = user.data().favorites;
      if (favorites.includes(req.body.recipeId)) {
        const index = favorites.indexOf(req.body.recipeId);
        favorites.splice(index, 1);
        await userRef.update({
          favorites,
        });
        if (Object.keys(recipe.data()).includes("no_likes")) {
          recipeRef.update({
            no_likes: --recipe.data().no_likes,
          });
        }
      } else {
        favorites.push(req.body.recipeId);
        await userRef.update({
          favorites,
        });
        if (Object.keys(recipe.data()).includes("no_likes")) {
          recipeRef.update({
            no_likes: ++recipe.data().no_likes,
          });
        } else {
          recipeRef.update({
            no_likes: 1,
          });
        }
      }
      res.json({
        status: "success",
        favorites,
      });
    } else {
      throw new AppError("Recipe id must be provided.", 400);
    }
  } catch (err) {
    next(err);
  }
};

export { getUserData, updateUser, changeFavoriteRecipes };
