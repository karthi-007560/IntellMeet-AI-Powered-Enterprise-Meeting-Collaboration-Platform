import mongoose from "mongoose";
import "dotenv";

export async function connectDB(): Promise<void> {
    const mongoURI = process.env.MONGO_URI;

    if(!mongoURI){
        throw new Error("MONGODB_URI is missing from .env file");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB Atlas connected successfully.");
}
