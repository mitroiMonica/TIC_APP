import AppError from "../utils/appError.js";
import db from "./../database/firestore.js";
import bcrypt from "bcrypt";
import fs from "fs";
import { faker, ne } from "@faker-js/faker";

const createFakeUsers = async (req, res, next) => {
  try {
    let { noUsers } = req.body;
    if (!noUsers) {
      throw new AppError("Number of fake users is required!", 400);
    }
    for (let i = 0; i < noUsers; i++) {
      let email = faker.internet.email();
      let password = await bcrypt.hash(faker.internet.password(), 10);
      const user = {
        email,
        password,
      };
      const userRef = await db.collection("Users").add(user);
      const userDb = await userRef.get();
      if (faker.datatype.boolean()) {
        const fakeImage = faker.image.avatar({
          width: 500,
          height: 500,
        });
        const response = await fetch(fakeImage);
        const buffer = await response.arrayBuffer();
        const path = `user-${userDb.id}-${Date.now()}.jpeg`;
        fs.writeFileSync("public/img/users/" + path, Buffer.from(buffer));
        await userRef.update({
          photo: path,
        });
      }
    }
    res.status(201).json({
      status: "success",
      message: "Users created",
    });
  } catch (err) {
    next(err);
  }
};

const createFakeRecipes = async (req, res, next) => {
  try {
    const { noRecipes } = req.body;
    if (!noRecipes) {
      throw new AppError("Number of fake recipes is required!", 400);
    }
    const usersSnapshot = await db.collection("Users").get();
    let users = [];
    usersSnapshot.forEach((user) => {
      users.push({
        id: user.id,
        email: user.data().email,
      });
    });
    for (let i = 0; i < noRecipes; i++) {
      let chosenUser = faker.helpers.arrayElement(users);
      const newRecipe = {
        name: faker.lorem.words({ min: 1, max: 10 }),
        author: chosenUser,
        date: Date.now(),
        ingredients: Array.from(
          { length: faker.number.int({ min: 3, max: 8 }) },
          () => faker.lorem.word()
        ),
        preparation_method: faker.lorem.paragraphs({ min: 13, max: 20 }),
      };
      if (faker.datatype.boolean()) {
        newRecipe.calories = faker.number.int({ min: 100, max: 900 }) + " kcal";
      }
      if (faker.datatype.boolean()) {
        newRecipe.tags = Array.from(
          { length: faker.number.int({ min: 0, max: 20 }) },
          () => faker.lorem.word()
        );
      }
      if (faker.datatype.boolean()) {
        newRecipe.category = faker.lorem.words({ min: 1, max: 3 });
      }
      if (faker.datatype.boolean()) {
        newRecipe.preparation_time =
          faker.number.int({ min: 0, max: 3 }) +
          "h " +
          faker.number.int({ min: 0, max: 60 }) +
          "min";
      }
      if (faker.datatype.boolean()) {
        newRecipe.no_servings = faker.number.int({ min: 3, max: 20 });
      }

      const fakeImage = faker.image.urlPicsumPhotos({
        width: 800,
        height: 500,
      });
      const response = await fetch(fakeImage);
      const buffer = await response.arrayBuffer();
      const path = `recipe-${chosenUser.id}-${Date.now()}.jpeg`;
      fs.writeFileSync("public/img/recipes/" + path, Buffer.from(buffer));
      newRecipe.picture = path;

      newRecipe.no_likes = faker.number.int({ min: 0, max: 250 });
      const recipeRef = db.collection("Recipes");
      await recipeRef.add(newRecipe);
    }
    res.status(201).json({
      status: "success",
      message: "Recipes successfully created!",
    });
  } catch (err) {
    next(err);
  }
};

const createFakeComments = async (req, res, next) => {
  try {
    let { noComments } = req.body;
    if (!noComments) {
      throw new AppError("Number of fake comments is required!", 400);
    }
    const usersSnapshot = await db.collection("Users").get();
    let users = [];
    usersSnapshot.forEach((user) => {
      users.push({
        id: user.id,
        email: user.data().email,
      });
    });
    const recipesSnapshot = await db.collection("Recipes").get();
    let recipes = [];
    recipesSnapshot.forEach((recipe) => {
      recipes.push(recipe);
    });
    for (let i = 0; i < noComments; i++) {
      let chosenUser = faker.helpers.arrayElement(users);
      let chosenRecipe = faker.helpers.arrayElement(recipes);
      const newComment = {
        text: faker.lorem.words({ min: 10, max: 100 }),
        author: chosenUser,
        date: Date.now(),
      };
      let recipeRef = db.collection("Recipes").doc(chosenRecipe.id);
      await recipeRef.collection("Comments").add(newComment);
      if (chosenUser.id !== chosenRecipe.data().author.id) {
        const newNotification = {
          type: "comment",
          text:
            "User '" +
            chosenUser.email +
            "' commented on '" +
            chosenRecipe.data().name +
            "' recipe. Go check it out!",
          date: Date.now(),
          read: false,
        };
        const notifiedUserRef = db
          .collection("Users")
          .doc(chosenRecipe.data().author.id);
        notifiedUserRef.collection("Notifications").add(newNotification); //nu pun await ca nu vreau sa astept pentru asta
      }
    }
    res.status(201).json({
      status: "success",
      message: "Comments successfully added",
    });
  } catch (err) {
    next(err);
  }
};

const setFavoritesRecipes = async (req, res, next) => {
  try {
    const { noLikes } = req.body;
    if (!noLikes) {
      throw new AppError("Number of likes is required!", 400);
    }
    const usersSnapshot = await db.collection("Users").get();
    let users = [];
    usersSnapshot.forEach((user) => {
      users.push({
        id: user.id,
        email: user.data().email,
        favorites: user.data().favorites,
      });
    });
    const recipesSnapshot = await db.collection("Recipes").get();
    let recipes = [];
    recipesSnapshot.forEach((recipe) => {
      recipes.push({
        id: recipe.id,
        name: recipe.data().name,
        authorId: recipe.data().author.id,
        noLikes: recipe.data().no_likes,
      });
    });
    for (let i = 0; i < noLikes; i++) {
      let chosenUser = faker.helpers.arrayElement(users);
      let chosenRecipe = faker.helpers.arrayElement(recipes);
      let favorites = chosenUser.favorites ? chosenUser.favorites : [];
      if (!favorites.includes(chosenRecipe.id)) {
        favorites.push(chosenRecipe.id);
        let userRef = db.collection("Users").doc(chosenUser.id);
        await userRef.update({
          favorites,
        });
        let recipeRef = db.collection("Recipes").doc(chosenRecipe.id);
        await recipeRef.update({
          no_likes: ++chosenRecipe.noLikes,
        });
        const newNotification = {
          type: "likes",
          text:
            "User '" +
            chosenUser.email +
            "' liked your '" +
            chosenRecipe.name +
            "' recipe.",
          date: Date.now(),
          read: false,
        };
        const notifiedUserRef = db
          .collection("Users")
          .doc(chosenRecipe.authorId);
        await notifiedUserRef.collection("Notifications").add(newNotification);
      }
    }
    res.json({
      status: "success",
      message: "Favorites successfully changed",
    });
  } catch (err) {
    next(err);
  }
};

export {
  createFakeUsers,
  createFakeRecipes,
  createFakeComments,
  setFavoritesRecipes,
};
