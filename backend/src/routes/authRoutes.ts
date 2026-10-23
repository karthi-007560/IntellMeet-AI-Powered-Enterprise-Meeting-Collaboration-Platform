
import { Router } from "express";
import {
    getAuthStatus,
    registerUser,
    loginUser,
    getCurrentUser,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";
import {
    validateRegistration,
    validateLogin,
} from "../validators/authValidator";

const router = Router();

router.get("/status", getAuthStatus);

router.post("/register", validateRegistration, registerUser);

router.post("/login", validateLogin, loginUser);

router.get("/me", authenticateToken, getCurrentUser);

export default router;
