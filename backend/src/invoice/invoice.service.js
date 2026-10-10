import { AppError } from "../utils/AppError.js";
import * as invoiceRepo from "./invoice.repository.js";

export async function getInvoices(filters) {
  return await invoiceRepo.findInvoices(filters);
}

export async function getInvoiceById(id) {
  const invoice = await invoiceRepo.findInvoiceById(id);
  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }
  return invoice;
}

export async function createInvoice(data) {
  // Generate a unique invoice_code if it's not provided
  if (!data.invoice_code) {
    data.invoice_code = `INV-${Date.now()}`;
  }

  const newId = await invoiceRepo.createInvoice(data);
  return await getInvoiceById(newId);
}

export async function updateInvoice(id, data) {
  const affectedRows = await invoiceRepo.updateInvoice(id, data);
  if (affectedRows === 0) {
    throw new AppError("Invoice not found or no changes made", 404);
  }
  return await getInvoiceById(id);
}

export async function deleteInvoice(id) {
  const affectedRows = await invoiceRepo.deleteInvoice(id);
  if (affectedRows === 0) {
    throw new AppError("Invoice not found", 404);
  }
  return { message: "Invoice deleted successfully" };
}
