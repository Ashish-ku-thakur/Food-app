import express from "express";
import dotenv from "dotenv";
import dbConnection from "./databaseConnection/mongoConnection.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import restaurentRouter from "./routes/restaurentRouter.js";
import path from "path";
import Restaurent from "./models/restaurent.js";

dotenv.config();

let app = express();
let PORT = process.env.PORT || 7000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/restaurent", restaurentRouter);


dbConnection()
  .then(() => {
    console.log("db connected");

    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
