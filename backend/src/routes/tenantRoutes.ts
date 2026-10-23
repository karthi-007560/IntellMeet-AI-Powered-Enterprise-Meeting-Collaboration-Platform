import { validateTenantCreation } from "../validators/tenantValidator";
import { Router } from "express";
import {
    createTenantController,
    getTenantController,
    getAllTenantsController,
} from "../controllers/tenantController";
import {
    authenticateToken,
    authorizeRoles,
} from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.post(
    "/",
    authorizeRoles("admin"),
    createTenantController
);

router.get(
    "/",
    authorizeRoles("admin"),
    getAllTenantsController
);


router.get(
    "/:tenantId",
    authorizeRoles("admin"),
    getTenantController
);

export default router;
