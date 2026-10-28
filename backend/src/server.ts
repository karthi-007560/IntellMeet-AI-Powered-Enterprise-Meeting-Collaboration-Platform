
import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./config/database";
import apiRoutes from "./routes";
import {
    notFoundHandler,
    errorHandler,
} from "./middleware/errorHandler.middleware";
import { requestLogger } from "./middleware/requestLogger.middleware";

const app = express();
const PORT = Number(process.env.PORT) || 5001;

// core middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);


app.use("/api", apiRoutes);


app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Amdox ERP backend is running",
    });
});

// Handle unknow routes
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer(): Promise<void> {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error: unknown) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
}

void startServer();
