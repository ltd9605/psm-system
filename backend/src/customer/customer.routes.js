import express from "express";
import * as customerController from "./customer.controller.js";

const router = express.Router();

router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomerById);
router.post("/", customerController.createCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);
router.post("/:id/cart", customerController.addProductToCart);
router.get("/:id/cart", customerController.getCart);
router.post("/:id/checkout", customerController.checkout);
router.put("/:id/orders/:orderId/cancel", customerController.cancelOrder);
router.get("/:id/orders", customerController.getOrders);
router.get("/:id/orders/:orderId", customerController.getOrderById);

export default router;
