
import type { Request, Response, NextFunction } from "express";

export function notFoundHandler(
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}

export function errorHandler(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error("Unhandled application error:", error);

    if (res.headersSent) {
        return;
    }

    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred.",
    });
}
