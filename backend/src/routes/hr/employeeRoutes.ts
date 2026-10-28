
import { Router } from "express";

import {
    createEmployeeController,
    getEmployeesController,
    getEmployeeController,
    updateEmployeeController,
    deleteEmployeeController,
} from "../../controllers/hr/employeeController";

import {
    validateCreateEmployee,
    validateUpdateEmployee,
} from "../../validators/hr/employeeValidator";

import {
    authenticateToken,
    authorizeRoles,
} from "../../middleware/authMiddleware";

import { tenantContext } from "../../middleware/tenantContext.middleware";

const router = Router();

router.use(authenticateToken);


router.use(authorizeRoles("admin", "manager"));

router.use(tenantContext);

router.post("/", createEmployeeController);

router.get("/", getEmployeesController);

router.get("/:employeeId", getEmployeeController);

router.patch("/:employeeId", updateEmployeeController);

router.delete("/:employeeId", deleteEmployeeController);

router.post("/", validateCreateEmployee, createEmployeeController);

router.patch("/:employeeId", validateUpdateEmployee, updateEmployeeController);

export default router;
