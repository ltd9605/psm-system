import * as customerService from "./customer.service.js";

export async function getCustomers(req, res) {
    try {
        const filters = req.query;
        const customers = await customerService.getCustomers(filters);
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getCustomerById(req, res) {
    try {
        const { id } = req.params;
        const customer = await customerService.getCustomerById(id);
        res.status(200).json(customer);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function createCustomer(req, res) {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateCustomer(req, res) {
    try {
        const { id } = req.params;
        const customer = await customerService.updateCustomer(id, req.body);
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteCustomer(req, res) {
    try {
        const { id } = req.params;
        const result = await customerService.deleteCustomer(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
