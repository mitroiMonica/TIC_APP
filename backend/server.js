import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { userRouter } from "./routes/userRoutes.js";
import { recipeRouter } from "./routes/recipeRoutes.js";
import { commentRouter } from "./routes/commentRoutes.js";
import { notificationRouter } from "./routes/notificationRoutes.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8081;
const app = express();

app.use(express.static("public")); //pentru imagini

app.use(express.json()); //adauga body-ul cererii la obiectul request sub forma de JSON
app.use(
  cors({
    origin: [process.env.FRONTEND_ROUTE],
    credentials: true,
    "Access-Control-Allow-Origin": "*",
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/notifications", notificationRouter);

app.use((error, request, response, next) => {
  response.status(error.statusCode || 500).json({
    status: "fail",
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
