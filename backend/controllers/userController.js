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
    await userRef.update({
      photo: req.file.filename,
    });
    res.json({
      status: "success",
      message: "Photo successfully updated!",
      filename: req.file.filename,
    });
  } catch (err) {
    next(err);
  }
};

export { getUserData, updateUser };
