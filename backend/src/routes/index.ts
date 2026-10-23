
import { Router } from "express";
import authRoutes from "./authRoutes";
import tenantRoutes from "./tenantRoutes";

const router = Router();

router.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Amdox ERP API is running",
    });
});

router.use("/auth", authRoutes);
router.use("/tenants", tenantRoutes);

export default router;
