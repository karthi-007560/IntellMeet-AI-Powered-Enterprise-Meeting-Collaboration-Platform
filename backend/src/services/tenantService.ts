
import mongoose from "mongoose";
import {
    createTenant,
    findTenantByCode,
    findTenantById,
    findAllTenants,
} from "../repositories/tenantRepository";
import {
    assignUserToTenant,
    findUserById,
} from "../repositories/userRepository";

interface CreateTenantInput {
    name: string;
    code: string;
    createdBy?: string;
}

export async function createTenantService(input: CreateTenantInput) {
    const name = input.name.trim();
    const code = input.code.trim().toUpperCase();

    if (!name || !code) {
        throw new Error("TENANT_NAME_AND_CODE_REQUIRED");
    }

    const existingTenant = await findTenantByCode(code);

    if (existingTenant) {
        throw new Error("TENANT_CODE_ALREADY_EXISTS");
    }

    return createTenant({
        name,
        code,
        createdBy: input.createdBy,
    });
}

export async function getTenantByIdService(tenantId: string) {
    if (!mongoose.isValidObjectId(tenantId)) {
        throw new Error("INVALID_TENANT_ID");
    }

    const tenant = await findTenantById(tenantId);

    if (!tenant) {
        throw new Error("TENANT_NOT_FOUND");
    }

    return tenant;
}

export async function getAllTenantsService() {
    return findAllTenants();
}


export async function assignUserToTenantService(
    userId: string,
    tenantId: string
) {
    if (
        !mongoose.isValidObjectId(userId) ||
        !mongoose.isValidObjectId(tenantId)
    ) {
        throw new Error("INVALID_USER_OR_TENANT_ID");
    }

    const tenant = await findTenantById(tenantId);

    if (!tenant) {
        throw new Error("TENANT_NOT_FOUND");
    }

    if (tenant.status !== "active") {
        throw new Error("TENANT_NOT_ACTIVE");
    }

    const user = await findUserById(userId);

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    if (user.tenantId) {
        throw new Error("USER_ALREADY_ASSIGNED_TO_TENANT");
    }

    const updatedUser = await assignUserToTenant(userId, tenantId);

    if (!updatedUser) {
        const currentUser = await findUserById(userId);

        if (!currentUser) {
            throw new Error("USER_NOT_FOUND");
        }

        if (currentUser.tenantId) {
            throw new Error("USER_ALREADY_ASSIGNED_TO_TENANT");
        }

        throw new Error("USER_ASSIGNMENT_FAILED");
    }

    return updatedUser;
}
