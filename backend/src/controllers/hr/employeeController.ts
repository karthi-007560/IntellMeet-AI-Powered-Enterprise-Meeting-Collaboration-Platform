
import type { Request, Response, NextFunction } from "express";

import {
    createEmployeeService,
    getEmployeeService,
    getEmployeesByTenantService,
    updateEmployeeService,
    deleteEmployeeService,
} from "../../services/hr/employeeService.js";

function getErrorStatus(error: unknown): number {
    const message = error instanceof Error ? error.message : "";

    if (message.startsWith("INVALID_")) {
        return 400;
    }

    switch (message) {
        case "EMPLOYEE_ID_REQUIRED":
            return 400;

        case "USER_NOT_FOUND":
        case "EMPLOYEE_NOT_FOUND":
            return 404;

        case "USER_NOT_ACTIVE":
        case "USER_NOT_ASSIGNED_TO_TENANT":
            return 400;

        case "EMPLOYEE_ALREADY_EXISTS_FOR_USER":
            return 409;

        default:
            return 500;
    }
}

function sendError(
    error: unknown,
    res: Response,
    next: NextFunction
): void {
    const status = getErrorStatus(error);

    if (status === 500) {
        next(error);
        return;
    }

    res.status(status).json({
        success: false,
        message: error instanceof Error
            ? error.message
            : "Request failed",
    });
}

// Use the tenant ID established by the tenant middleware.
function getTenantId(req: Request): string | undefined {
    return req.tenantId;
}

function getEmployeeId(req: Request): string | undefined {
    const employeeId = req.params.employeeId;

    return typeof employeeId === "string" && employeeId.trim()
        ? employeeId.trim()
        : undefined;
}

export async function createEmployeeController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tenantId = getTenantId(req);

        if (!tenantId) {
            res.status(403).json({
                success: false,
                message: "TENANT_CONTEXT_REQUIRED",
            });
            return;
        }

        const {
            userId,
            employeeId,
            department,
            designation,
            phone,
            dateOfJoining,
            status,
        } = req.body;

        if (
            typeof userId !== "string" ||
            typeof employeeId !== "string"
        ) {
            res.status(400).json({
                success: false,
                message: "USER_ID_AND_EMPLOYEE_ID_REQUIRED",
            });
            return;
        }

        let parsedDate: Date | undefined;

        if (dateOfJoining !== undefined) {
            if (typeof dateOfJoining !== "string") {
                res.status(400).json({
                    success: false,
                    message: "INVALID_DATE_OF_JOINING",
                });
                return;
            }

            parsedDate = new Date(dateOfJoining);

            if (Number.isNaN(parsedDate.getTime())) {
                res.status(400).json({
                    success: false,
                    message: "INVALID_DATE_OF_JOINING",
                });
                return;
            }
        }

        const employee = await createEmployeeService({
            userId,
            tenantId,
            employeeId,
            department,
            designation,
            phone,
            dateOfJoining: parsedDate,
            status,
        });

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee,
        });
    } catch (error) {
        sendError(error, res, next);
    }
}

export async function getEmployeesController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tenantId = getTenantId(req);

        if (!tenantId) {
            res.status(403).json({
                success: false,
                message: "TENANT_CONTEXT_REQUIRED",
            });
            return;
        }

        const employees =
            await getEmployeesByTenantService(tenantId);

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });
    } catch (error) {
        sendError(error, res, next);
    }
}

export async function getEmployeeController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tenantId = getTenantId(req);
        const employeeId = getEmployeeId(req);

        if (!tenantId) {
            res.status(403).json({
                success: false,
                message: "TENANT_CONTEXT_REQUIRED",
            });
            return;
        }

        if (!employeeId) {
            res.status(400).json({
                success: false,
                message: "EMPLOYEE_ID_REQUIRED",
            });
            return;
        }

        const employee = await getEmployeeService(
            employeeId,
            tenantId
        );

        res.status(200).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        sendError(error, res, next);
    }
}

export async function updateEmployeeController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tenantId = getTenantId(req);
        const employeeId = getEmployeeId(req);

        if (!tenantId) {
            res.status(403).json({
                success: false,
                message: "TENANT_CONTEXT_REQUIRED",
            });
            return;
        }

        if (!employeeId) {
            res.status(400).json({
                success: false,
                message: "EMPLOYEE_ID_REQUIRED",
            });
            return;
        }

        const employee = await updateEmployeeService(
            employeeId,
            tenantId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: employee,
        });
    } catch (error) {
        sendError(error, res, next);
    }
}

export async function deleteEmployeeController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tenantId = getTenantId(req);
        const employeeId = getEmployeeId(req);

        if (!tenantId) {
            res.status(403).json({
                success: false,
                message: "TENANT_CONTEXT_REQUIRED",
            });
            return;
        }

        if (!employeeId) {
            res.status(400).json({
                success: false,
                message: "EMPLOYEE_ID_REQUIRED",
            });
            return;
        }

        await deleteEmployeeService(employeeId, tenantId);

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
        });
    } catch (error) {
        sendError(error, res, next);
    }
}
