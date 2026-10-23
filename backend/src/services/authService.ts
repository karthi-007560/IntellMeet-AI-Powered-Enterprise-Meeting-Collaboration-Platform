
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    createUser,
    findUserByEmail,
    findUserByEmailWithPassword,
} from "../repositories/userRepository";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export async function registerService(input: RegisterInput) {
    const normalizedEmail = input.email.trim().toLowerCase();

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    return createUser({
        name: input.name,
        email: normalizedEmail,
        password: hashedPassword,
    });
}

export async function loginService(input: LoginInput) {
    const normalizedEmail = input.email.trim().toLowerCase();

    const user = await findUserByEmailWithPassword(normalizedEmail);

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    if (!user.isActive) {
        throw new Error("ACCOUNT_INACTIVE");
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET_MISSING");
    }

    const expiresIn =
        (process.env.JWT_EXPIRES_IN || "15m") as jwt.SignOptions["expiresIn"];

    const token = jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
        },
        jwtSecret,
        { expiresIn }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}
