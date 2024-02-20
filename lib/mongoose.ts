import mongoose from "mongoose";

const isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    console.log("Missing MongoDB URL");
  }

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL as string, {
      dbName: "devflow",
    });
    console.log("Database is connected");
  } catch (error) {
    console.log("Database connection failed ", error);
  }
};
