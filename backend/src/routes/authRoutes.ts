
import { Router } from "express";
import {
    getAuthStatus,
    registerUser,
    loginUser,
    getCurrentUser,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/status", getAuthStatus);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticateToken, getCurrentUser);

export default router;
