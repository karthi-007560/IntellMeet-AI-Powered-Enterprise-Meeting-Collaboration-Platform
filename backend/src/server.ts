import express from "express";
import cors from "cors";
import "dotenv";
import {connectDB} from "./config/database";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req,res) => {
    res.status(200).json({
        success: true,
        message: "Amdox ERP backend is running"
    });
});

async function startServer(): Promise<void> {
    try{
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error){
        console.log("Failed to start the server:", error);
        process.exit(1);
    }
}

void startServer();
