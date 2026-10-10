import * as invoiceService from "./invoice.service.js";

export async function getInvoices(req, res) {
  const filters = req.query;
  const invoices = await invoiceService.getInvoices(filters);
  res.status(200).json(invoices);
}

export async function getInvoiceById(req, res) {
  const { id } = req.params;
  const invoice = await invoiceService.getInvoiceById(id);
  res.status(200).json(invoice);
}

export async function createInvoice(req, res) {
  const invoice = await invoiceService.createInvoice(req.body);
  res.status(201).json(invoice);
}

export async function updateInvoice(req, res) {
  const { id } = req.params;
  const invoice = await invoiceService.updateInvoice(id, req.body);
  res.status(200).json(invoice);
}

export async function deleteInvoice(req, res) {
  const { id } = req.params;
  const result = await invoiceService.deleteInvoice(id);
  res.status(200).json(result);
}
