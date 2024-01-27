import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import db from "./../database/firestore.js";
import bcrypt from "bcrypt";

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm } = req.body;
    if (!email || !password || !passwordConfirm) {
      throw new AppError("All fields should be completed!", 400);
    } else if (password.length < 8) {
      throw new AppError("Passwords should have at least 8 characters!", 400);
    } else if (password !== passwordConfirm) {
      throw new AppError("Passwords should match!", 400);
    }
    const userRef = db.collection("Users");
    const userFound = await userRef.where("email", "==", email).get();
    if (!userFound.empty) {
      throw new AppError("User already registered!", 403);
    }
    const newUser = {
      email,
      password: await bcrypt.hash(password, 10),
      favorites: [],
    };
    const user = await userRef.add(newUser);
    const token = createToken({
      userId: user.id,
      // userEmail: email,
    });
    res.status(201).json({
      status: "success",
      token,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("All fields should be completed!", 400);
    }
    const userSnapshot = await db
      .collection("Users")
      .where("email", "==", email)
      .get();
    if (userSnapshot.empty) {
      throw new AppError("Incorrect email or password!");
    }
    const user = userSnapshot.docs[0].data();
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (!isSamePassword) {
      throw new AppError("Incorrect email or password!");
    }
    const token = createToken({
      userId: userSnapshot.docs[0].id,
      // userEmail: user.email,
    });
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    next(err);
  }
};

const protectRoutes = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        throw new AppError(
          "You are not logged in! Please log in to get access.",
          401
        );
      }
    } else {
      throw new AppError("Not logged in!", 401);
    }
    const jwtDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = jwtDecoded.userId;
    next();
    // in order to protect better our route we can
    // 1. check if user still exists - or the payload is same with the user logged in
    // 2. check if user changed its password
  } catch (err) {
    if (
      [
        "invalid token",
        "jwt expired",
        "jwt malformed",
        "invalid signature",
        "jwt signature is required",
      ].includes(err.message)
    ) {
      err.statusCode = 401;
    }
    if ("jwt expired" === err.message) {
      err.message += ". Please login again.";
    }
    next(err);
  }
};

export { register, login, protectRoutes };
