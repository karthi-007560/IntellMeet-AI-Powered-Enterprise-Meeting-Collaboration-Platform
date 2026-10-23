
import { Tenant } from "../models/Tenant";

interface CreateTenantInput {
    name: string;
    code: string;
    createdBy?: string;
}

export async function createTenant(input: CreateTenantInput) {
    return Tenant.create({
        name: input.name.trim(),
        code: input.code.trim().toUpperCase(),
        ...(input.createdBy ? { createdBy: input.createdBy } : {}),
    });
}

export async function findTenantById(tenantId: string) {
    return Tenant.findById(tenantId);
}

export async function findTenantByCode(code: string) {
    return Tenant.findOne({
        code: code.trim().toUpperCase(),
    });
}

export async function findAllTenants() {
    return Tenant.find().sort({ createdAt: -1 });
}
