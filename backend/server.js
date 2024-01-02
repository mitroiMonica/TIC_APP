import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { userRouter } from "./routes/userRoutes.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8081;

const app = express();

app.use(express.json()); //adauga body-ul cererii la obiectul request sub forma de JSON
app.use(
  cors({
    // origin: [process.env.FRONTEND_ROUTE],
    // credentials: true,
  })
);

app.use("/api/v1/users", userRouter);

app.use((error, request, response, next) => {
  response.status(error.statusCode || 500).json({
    status: "fail",
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
