import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import "dotenv/config";

export function getAuthStatus(_req: Request, res: Response): void {
    res.status(200).json({
        success: true,
        message: "Authentication routes are working.",
    });
}

export async function registerUser(req: Request, res: Response): Promise<void> {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            res.status(400).json({
                success: false,
                message: "Valid name, email and password are required.",
            });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            res.status(400).json({
                success: false,
                message: "Please provide valid email address.",
            });
            return;
        }

        if (typeof password !== "string" || password.length < 8) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            });
            return;
        }

        if (typeof name !== "string" || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Please provide a valid name."
            });
            return;
        }

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });


        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            res.status(409).json({
                success: false,
                message: "An account with this email already exist.",
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

export async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
            res.status(400).json({
                success: false,
                message: "Email and Password are required.",
            });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            });
            return;
        }

        if (!user.isActive) {
            res.status(400).json({
                success: false,
                message: "your account is inactive.",
            });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        const expiresIn = process.env.JWT_EXPIRES_IN || "15m";

        if (!jwtSecret) {
            console.error("JWT_SECRET is not configured.");

            res.status(500).json({
                success: false,
                message: "Authentication configuration error.",
            });
            return;
        }

        const token = jwt.sign(
            {
                sub: user._id.toString(),
                role: user.role,
            },
            jwtSecret,
            {
                expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
            }
        );

        res.status(200).json({
            success: true,
            message: "login successfully.",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error: unknown) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "An unexpected error occurred during login.",
        });
    }
}
