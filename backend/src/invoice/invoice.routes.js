import express from "express";
import * as invoiceController from "./invoice.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  employeeOnly,
  managerOnly,
} from "../middlewares/employee.middleware.js";

const router = express.Router();

router.get("/", authenticate, employeeOnly, invoiceController.getInvoices);
router.get(
  "/:id",
  authenticate,
  employeeOnly,
  invoiceController.getInvoiceById,
);
router.post("/", authenticate, employeeOnly, invoiceController.createInvoice);
router.put("/:id", authenticate, managerOnly, invoiceController.updateInvoice);
router.delete(
  "/:id",
  authenticate,
  managerOnly,
  invoiceController.deleteInvoice,
);

export default router;
