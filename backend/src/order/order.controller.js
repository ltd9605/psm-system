import * as orderService from "./order.service.js";

export async function getOrders(req, res) {
    try {
        const filters = req.query;
        const orders = await orderService.getOrders(filters);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getOrderStats(req, res) {
    try {
        const filters = req.query;
        const stats = await orderService.getOrderStats(filters);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        const order = await orderService.getOrderById(id);
        res.status(200).json(order);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function createOrder(req, res) {
    try {
        const order = await orderService.createOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateOrder(req, res) {
    try {
        const { id } = req.params;
        const order = await orderService.updateOrder(id, req.body);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteOrder(req, res) {
    try {
        const { id } = req.params;
        const result = await orderService.deleteOrder(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function approveOrder(req, res) {
    try {
        const { id } = req.params;
        const employeeId = req.user.userId;
        const order = await orderService.updateOrder(id, { status: 'CONFIRMED', employee_id: employeeId });
        res.status(200).json({ message: "Order approved successfully", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function completeOrder(req, res) {
    try {
        const { id } = req.params;
        const employeeId = req.user.userId;
        const order = await orderService.updateOrder(id, { status: 'COMPLETED', employee_id: employeeId });
        res.status(200).json({ message: "Order completed and invoice generated successfully", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function cancelOrder(req, res) {
    try {
        const { id } = req.params;
        const employeeId = req.user.userId;
        const order = await orderService.updateOrder(id, { status: 'CANCELLED', employee_id: employeeId });
        res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
