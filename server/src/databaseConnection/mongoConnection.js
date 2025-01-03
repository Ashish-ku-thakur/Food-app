import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let dbConnection = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

export default dbConnection;
