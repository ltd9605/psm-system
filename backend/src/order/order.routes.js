import express from "express";
import * as orderController from "./order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { employeeOnly, managerOnly, adminOnly } from "../middlewares/employee.middleware.js";

const router = express.Router();

router.get("/", authenticate, employeeOnly, orderController.getOrders);
router.get("/stats", authenticate, managerOnly, orderController.getOrderStats);
router.get("/:id", authenticate, orderController.getOrderById);
router.post("/", authenticate, orderController.createOrder); // Customers create orders
router.put("/:id", authenticate, employeeOnly, orderController.updateOrder);
router.delete("/:id", authenticate, adminOnly, orderController.deleteOrder);

// Employee specific actions
router.put("/:id/approve", authenticate, employeeOnly, orderController.approveOrder);
router.put("/:id/cancel", authenticate, employeeOnly, orderController.cancelOrder);

export default router;
