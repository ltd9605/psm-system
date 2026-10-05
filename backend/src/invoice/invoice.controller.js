import * as invoiceService from "./invoice.service.js";

export async function getInvoices(req, res) {
    try {
        const filters = req.query;
        const invoices = await invoiceService.getInvoices(filters);
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getInvoiceById(req, res) {
    try {
        const { id } = req.params;
        const invoice = await invoiceService.getInvoiceById(id);
        res.status(200).json(invoice);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function createInvoice(req, res) {
    try {
        const invoice = await invoiceService.createInvoice(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateInvoice(req, res) {
    try {
        const { id } = req.params;
        const invoice = await invoiceService.updateInvoice(id, req.body);
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteInvoice(req, res) {
    try {
        const { id } = req.params;
        const result = await invoiceService.deleteInvoice(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
