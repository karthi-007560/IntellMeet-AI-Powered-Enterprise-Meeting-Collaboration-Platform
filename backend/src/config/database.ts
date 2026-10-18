import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB(): Promise<void> {
    const mongoURI = process.env.MONGO_URI;

    if(!mongoURI){
        throw new Error("MONGO_URI is missing from .env file");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB Atlas connected successfully.");
}
