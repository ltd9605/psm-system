import express from "express";
import * as employeeController from "./employee.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/employee.middleware.js";

const router = express.Router();

router.get("/", authenticate, adminOnly, employeeController.getEmployees);
router.get("/:id", authenticate, adminOnly, employeeController.getEmployeeById);
router.post("/", authenticate, adminOnly, employeeController.createEmployee);
router.put("/:id", authenticate, adminOnly, employeeController.updateEmployee);
router.delete("/:id", authenticate, adminOnly, employeeController.deleteEmployee);

export default router;
