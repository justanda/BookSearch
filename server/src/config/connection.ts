import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

const connectDB = async (): Promise<typeof mongoose.connection> => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log("Connected to the database");
    return connection.connection;
  } catch (error) {
    console.error("Error connecting to the database: ", error);
    throw error;
  }
};

export default connectDB;
