import AppError from "../utils/appError.js";
import db from "./../database/firestore.js";

const createComment = async (req, res, next) => {
  try {
    const { text, recipeId } = req.body;
    if (!text || !recipeId) {
      throw new AppError("Complete all required fields!", 400);
    }
    const userRef = db.collection("Users").doc(req.userId);
    const user = await userRef.get();
    const recipeRef = db.collection("Recipes").doc(req.body.recipeId);
    const recipe = await recipeRef.get();
    if (!recipe.exists) {
      throw new AppError("Invalid recipe!");
    }
    const newComment = {
      text,
      author: {
        id: req.userId,
        email: user.data().email,
      },
      date: Date.now(),
    };
    await recipeRef.collection("Comments").add(newComment);
    if (req.userId !== recipe.data().author.id) {
      const newNotification = {
        type: "comment",
        text:
          "User '" +
          user.data().email +
          "' commented on '" +
          recipe.data().name +
          "' recipe. Go check it out!",
        date: Date.now(),
        read: false,
      };
      const notifiedUserRef = db
        .collection("Users")
        .doc(recipe.data().author.id);
      notifiedUserRef.collection("Notifications").add(newNotification); //nu pun await ca nu vreau sa astept pentru asta
    }
    res.status(201).json({
      status: "success",
      message: "Comment successfully added",
      comment: newComment,
    });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { recipeId, commentId } = req.body;
    if (!recipeId || !commentId) {
      throw new AppError("Recipe id and comment id must be provided");
    }
    const recipeRef = db.collection("Recipes").doc(recipeId);
    const recipe = await recipeRef.get();
    if (!recipe.exists) {
      throw new AppError("Invalid recipe!", 400);
    }
    const commentRef = recipeRef.collection("Comments").doc(commentId);
    const comment = await commentRef.get();
    if (!comment.exists) {
      throw new AppError("Invalid comment", 400);
    }
    if (comment.data().author.id !== req.userId) {
      throw new AppError("You can only delete your own comments", 400);
    }
    await commentRef.delete();
    res.json({
      status: "success",
      message: "Comment successfully deleted",
    });
  } catch (err) {
    next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { text, recipeId, commentId } = req.body;
    if (!text) {
      throw new AppError("Complete all required fields!", 400);
    }
    if (!recipeId || !commentId) {
      throw new AppError("Recipe id and comment id must be provided");
    }
    const recipeRef = db.collection("Recipes").doc(recipeId);
    const recipe = await recipeRef.get();
    if (!recipe.exists) {
      throw new AppError("Invalid recipe!", 400);
    }
    const commentRef = recipeRef.collection("Comments").doc(commentId);
    const comment = await commentRef.get();
    if (!comment.exists) {
      throw new AppError("Invalid comment", 400);
    }
    if (comment.data().author.id !== req.userId) {
      throw new AppError("You can only modify your own comments", 400);
    }
    const commentUpdated = {
      text,
      edited: true,
    };
    await commentRef.update(commentUpdated);
    res.json({
      status: "success",
      message: "Comment successfully updated",
      comment: commentUpdated,
    });
  } catch (err) {
    next(err);
  }
};

export { createComment, deleteComment, updateComment };
