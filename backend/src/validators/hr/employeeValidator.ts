import type { Request, Response, NextFunction } from "express";

const allowedStatuses = ["active", "inactive", "on-leave"];

function isOptionalString(
    value: unknown
): boolean {
    return value === undefined || typeof value === "string";
}

function validateOptionalFields(
    body: Record<string, unknown>
): string | undefined {
    const stringFields = [
        "department",
        "designation",
        "phone",
    ];

    for (const field of stringFields) {
        if (!isOptionalString(body[field])) {
            return `${field.toUpperCase()}_MUST_BE_A_STRING`;
        }
    }

    if (
        body.status !== undefined &&
        (typeof body.status !== "string" ||
            !allowedStatuses.includes(body.status))
    ) {
        return "INVALID_EMPLOYEE_STATUS";
    }

    if (body.dateOfJoining !== undefined) {
        if (
            typeof body.dateOfJoining !== "string" ||
            Number.isNaN(Date.parse(body.dateOfJoining))
        ) {
            return "INVALID_DATE_OF_JOINING";
        }
    }

    return undefined;
}

export function validateCreateEmployee(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const { userId, employeeId } = req.body ?? {};

    if (typeof userId !== "string" || !userId.trim()) {
        res.status(400).json({
            success: false,
            message: "USER_ID_REQUIRED",
        });
        return;
    }

    if (
        typeof employeeId !== "string" ||
        !employeeId.trim()
    ) {
        res.status(400).json({
            success: false,
            message: "EMPLOYEE_ID_REQUIRED",
        });
        return;
    }

    const error = validateOptionalFields(req.body);

    if (error) {
        res.status(400).json({
            success: false,
            message: error,
        });
        return;
    }

    next();
}

export function validateUpdateEmployee(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const body = req.body;

    if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {
        res.status(400).json({
            success: false,
            message: "INVALID_REQUEST_BODY",
        });
        return;
    }

    const allowedFields = [
        "employeeId",
        "department",
        "designation",
        "phone",
        "dateOfJoining",
        "status",
    ];

    const suppliedFields = Object.keys(body);

    if (
        suppliedFields.length === 0 ||
        suppliedFields.some(
            (field) => !allowedFields.includes(field)
        )
    ) {
        res.status(400).json({
            success: false,
            message: "INVALID_OR_EMPTY_UPDATE_FIELDS",
        });
        return;
    }

    if (
        body.employeeId !== undefined &&
        (typeof body.employeeId !== "string" ||
            !body.employeeId.trim())
    ) {
        res.status(400).json({
            success: false,
            message: "EMPLOYEE_ID_REQUIRED",
        });
        return;
    }

    const error = validateOptionalFields(body);

    if (error) {
        res.status(400).json({
            success: false,
            message: error,
        });
        return;
    }

    next();
}
