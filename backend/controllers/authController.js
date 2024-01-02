import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";

const register = async (req, res, next) => {
  //   const newUser = await
};

const login = async (req, res, next) => {
  try {
    const token = jwt.sign(
      {
        email: "monik",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    next(err);
  }
};

export { register, login };
