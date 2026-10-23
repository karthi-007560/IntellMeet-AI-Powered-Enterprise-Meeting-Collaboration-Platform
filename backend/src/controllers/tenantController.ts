import mongoose from "mongoose";
import type { Request, Response, NextFunction } from "express";
import {
    createTenantService,
    getTenantByIdService,
    getAllTenantsService,
} from "../services/tenantService";

export async function createTenantController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { name, code } = req.body;

        const tenant = await createTenantService({
            name,
            code,
            createdBy: req.auth?.userId,
        });

        res.status(201).json({
            success: true,
            message: "Tenant created successfully.",
            data: tenant,
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "TENANT_CODE_ALREADY_EXISTS") {
            res.status(409).json({
                success: false,
                message: "A tenant with this code already exists.",
            });
            return;
        }

        if (error instanceof Error && error.message === "TENANT_NAME_AND_CODE_REQUIRED") {
            res.status(400).json({
                success: false,
                message: "Tenant name and code are required.",
            });
            return;
        }

        next(error);
    }
}


export async function getTenantController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tenantId = req.params.tenantId;

        if (
            typeof tenantId !== "string" ||
            !mongoose.isValidObjectId(tenantId)
        ) {
            res.status(400).json({
                success: false,
                message: "Invalid tenant ID.",
            });
            return;
        }

        const tenant = await getTenantByIdService(tenantId);

        res.status(200).json({
            success: true,
            data: tenant,
        });
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            error.message === "TENANT_NOT_FOUND"
        ) {
            res.status(404).json({
                success: false,
                message: "Tenant not found.",
            });
            return;
        }

        next(error);
    }
}


export async function getAllTenantsController(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tenants = await getAllTenantsService();

        res.status(200).json({
            success: true,
            count: tenants.length,
            data: tenants,
        });
    } catch (error: unknown) {
        next(error);
    }
}
