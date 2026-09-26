import express from "express";
import * as productController from "./product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { employeeOnly } from "../middlewares/employee.middleware.js";

const router = express.Router();
router.get(
    "/",
    productController.getProducts
);
router.post(
    "/",
    authenticate, employeeOnly,
    productController.createProduct
);
router.patch(
    "/:id",
    authenticate, employeeOnly,
    productController.updateProduct
);
router.delete(
    "/:id",
    authenticate, employeeOnly,
    productController.deleteProduct
)

export default router;