import express from "express";
import * as productController from "./product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { managerOnly } from "../middlewares/employee.middleware.js";

const router = express.Router();
router.get(
    "/",
    productController.getProducts
);
router.post(
    "/",
    authenticate, managerOnly,
    productController.createProduct
);
router.patch(
    "/:id",
    authenticate, managerOnly,
    productController.updateProduct
);
router.delete(
    "/:id",
    authenticate, managerOnly,
    productController.deleteProduct
);
router.get(
    "/:id/quantity",
    productController.checkProductQuantity
);

export default router;