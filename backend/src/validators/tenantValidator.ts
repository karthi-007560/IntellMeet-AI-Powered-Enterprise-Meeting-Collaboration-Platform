import {Request, Response, NextFunction} from "express";

export function validateTenantCreation(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const {name, code} = req.body;

    if(typeof name !== "string" || !name.trim() || typeof code !== "string" || !code.trim()){
        res.status(400).json({
            success: false,
            message: "Tenant name and code are required.",
        });
        return;
    }

    if(name.trim().length > 150){
        res.status(400).json({
            success: false,
            message: "Tenant name cannot exceed 150 characters.",
        });
        return;
    }

    const codeRegex = /^[A-Za-z0-9_-]+$/;

    if(!codeRegex.test(code.trim())){
        res.status(400).json({
            success: false,
            message: "Tenant code can contain only letters, numbers, underscores, and hyphens.",
        });
        return;
    }

    next();
}