import express from "express";
import * as brandController from "./brand.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { managerOnly } from "../middlewares/employee.middleware.js";

const router = express.Router();

router.get("/", brandController.getBrands);
router.get("/:id", brandController.getBrandById);
router.post("/", authenticate, managerOnly, brandController.createBrand);
router.put("/:id", authenticate, managerOnly, brandController.updateBrand);
router.delete("/:id", authenticate, managerOnly, brandController.deleteBrand);

export default router;
