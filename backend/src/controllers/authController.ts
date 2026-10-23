
import type { Request, Response } from "express";
import {
    registerService,
    loginService,
} from "../services/authService";
import { findUserById } from "../repositories/userRepository";

export function getAuthStatus(_req: Request, res: Response): void {
    res.status(200).json({
        success: true,
        message: "Authentication routes are working.",
    });
}

export async function registerUser(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { name, email, password } = req.body;

        const user = await registerService({
            name,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            error.message === "EMAIL_ALREADY_EXISTS"
        ) {
            res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
            return;
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === 11000
        ) {
            res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
            return;
        }

        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "An unexpected error occurred during registration.",
        });
    }
}

export async function loginUser(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { email, password } = req.body;

        const result = await loginService({
            email,
            password,
        });

        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: result,
        });
    } catch (error: unknown) {
        if (!(error instanceof Error)) {
            console.error("Login error:", error);
            res.status(500).json({
                success: false,
                message: "An unexpected error occurred during login.",
            });
            return;
        }

        switch (error.message) {
            case "INVALID_CREDENTIALS":
                res.status(401).json({
                    success: false,
                    message: "Invalid email or password.",
                });
                return;

            case "ACCOUNT_INACTIVE":
                res.status(403).json({
                    success: false,
                    message: "Your account is inactive.",
                });
                return;

            case "JWT_SECRET_MISSING":
                console.error("JWT_SECRET is not configured.");
                res.status(500).json({
                    success: false,
                    message: "Authentication configuration error.",
                });
                return;

            default:
                console.error("Login error:", error);
                res.status(500).json({
                    success: false,
                    message: "An unexpected error occurred during login.",
                });
        }
    }
}

export async function getCurrentUser(
    req: Request,
    res: Response
): Promise<void> {
    try {
        if (!req.auth) {
            res.status(401).json({
                success: false,
                message: "Authentication is required.",
            });
            return;
        }

        const user = await findUserById(req.auth.userId);

        if (!user || !user.isActive) {
            res.status(401).json({
                success: false,
                message: "User is not authorized to access this resource.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Current user retrieved successfully.",
            data: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: unknown) {
        console.error("Get current user error:", error);

        res.status(500).json({
            success: false,
            message: "An unexpected error occurred while retrieving the user.",
        });
    }
}
