
import mongoose from "mongoose";
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

export async function findUsersByTenantId(tenantId: string) {
    if (!mongoose.isValidObjectId(tenantId)) {
        throw new Error("INVALID_TENANT_ID");
    }

    return User.find({ tenantId })
        .select("-password")
        .sort({ createdAt: -1 });
}


export async function assignUserToTenant(
    userId: string,
    tenantId: string
) {
    if (
        !mongoose.isValidObjectId(userId) ||
        !mongoose.isValidObjectId(tenantId)
    ) {
        throw new Error("INVALID_USER_OR_TENANT_ID");
    }

    return User.findOneAndUpdate(
        {
            _id: userId,
            tenantId: null,
        },
        {
            $set: { tenantId },
        },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");
}
