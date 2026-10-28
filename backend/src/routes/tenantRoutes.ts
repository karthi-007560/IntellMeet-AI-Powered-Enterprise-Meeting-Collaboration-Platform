
import { Router } from "express";
import { validateTenantCreation } from "../validators/tenantValidator";
import {
    createTenantController,
    getTenantController,
    getAllTenantsController,
    assignUserToTenantController,
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
    validateTenantCreation,
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


router.patch(
    "/assign-user",
    authorizeRoles("admin"),
    assignUserToTenantController
);

export default router;
