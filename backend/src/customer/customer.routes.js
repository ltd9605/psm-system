import express from "express";
import * as customerController from "./customer.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/employee.middleware.js";

const router = express.Router();

router.get("/", authenticate, adminOnly, customerController.getCustomers);
router.get("/:id", authenticate, customerController.getCustomerById); // Customer or Admin
router.post("/", customerController.createCustomer); // Registration
router.put("/:id", authenticate, customerController.updateCustomer); // Customer or Admin
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  customerController.deleteCustomer,
); // Admin only

router.post("/:id/cart", authenticate, customerController.addProductToCart);
router.put(
  "/:id/cart/:productId",
  authenticate,
  customerController.updateCartItem,
);
router.delete(
  "/:id/cart/:productId",
  authenticate,
  customerController.removeCartItem,
);
router.get("/:id/cart", authenticate, customerController.getCart);
router.post("/:id/checkout", authenticate, customerController.checkout);
router.put(
  "/:id/orders/:orderId/cancel",
  authenticate,
  customerController.cancelOrder,
);
router.get("/:id/orders", authenticate, customerController.getOrders);
router.get(
  "/:id/orders/:orderId",
  authenticate,
  customerController.getOrderById,
);

export default router;
