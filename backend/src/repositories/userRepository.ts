
import { User } from "../models/User";

export async function findUserByEmail(email: string) {
    return User.findOne({
        email: email.trim().toLowerCase(),
    });
}

export async function findUserById(userId: string) {
    return User.findById(userId);
}

export async function createUser(userData: {
    name: string;
    email: string;
    password: string;
}) {
    return User.create({
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
    });
}

export async function findUserByEmailWithPassword(email: string) {
    return User.findOne({
        email: email.trim().toLowerCase(),
    }).select("+password");
}
