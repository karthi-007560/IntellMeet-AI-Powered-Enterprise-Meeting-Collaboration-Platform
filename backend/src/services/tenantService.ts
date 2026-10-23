
import {
    createTenant,
    findTenantByCode,
    findTenantById,
    findAllTenants,
} from "../repositories/tenantRepository";

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
    const tenant = await findTenantById(tenantId);

    if (!tenant) {
        throw new Error("TENANT_NOT_FOUND");
    }

    return tenant;
}

export async function getAllTenantsService() {
    return findAllTenants();
}
