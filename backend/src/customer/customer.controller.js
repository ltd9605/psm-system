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

export async function addProductToCart(req, res) {
    try {
        const { id: customerId } = req.params;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ error: "productId and quantity are required" });
        }

        const result = await customerService.addProductToCart(customerId, productId, quantity);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getCart(req, res) {
    try {
        const { id: customerId } = req.params;
        const cart = await customerService.getCart(customerId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function checkout(req, res) {
    try {
        const { id: customerId } = req.params;
        const result = await customerService.checkout(customerId, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function cancelOrder(req, res) {
    try {
        const { id: customerId, orderId } = req.params;
        const result = await customerService.cancelOrder(customerId, orderId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getOrders(req, res) {
    try {
        const { id: customerId } = req.params;
        const { status } = req.query;
        const orders = await customerService.getOrders(customerId, status);
        res.status(200).json(orders);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function getOrderById(req, res) {
    try {
        const { id: customerId, orderId } = req.params;
        const order = await customerService.getOrderById(customerId, orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

