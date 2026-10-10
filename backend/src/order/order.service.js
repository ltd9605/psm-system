import * as orderRepo from "./order.repository.js";
import * as invoiceRepo from "../invoice/invoice.repository.js";

export async function getOrders(filters) {
    return await orderRepo.findOrders(filters);
}

export async function getOrderStats(filters) {
    return await orderRepo.getOrderStats(filters);
}

export async function getOrderById(id) {
    const order = await orderRepo.findOrderById(id);
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
}

export async function createOrder(data) {
    if (!data.order_code) {
        data.order_code = `ORD-${Date.now()}`;
    }

    const newId = await orderRepo.createOrder(data);
    return await getOrderById(newId);
}

export async function updateOrder(id, data) {
    const existingOrder = await getOrderById(id);

    if (data.status) {
        // Automatically set timestamps based on status if they are not explicitly provided
        const now = new Date();
        if (data.status === 'CONFIRMED' && !data.confirmed_at) data.confirmed_at = now;
        if (data.status === 'COMPLETED' && !data.completed_at) data.completed_at = now;
        if (data.status === 'CANCELLED' && !data.cancelled_at) data.cancelled_at = now;
    }

    const affectedRows = await orderRepo.updateOrder(id, data);
    if (affectedRows === 0) {
        throw new Error("Order not found or no changes made");
    }

    // Automatically generate invoice if status changes to COMPLETED
    if (data.status === 'COMPLETED' && existingOrder.status !== 'COMPLETED') {
        try {
            await invoiceRepo.createInvoice({
                invoice_code: `INV-${Date.now()}`,
                order_id: existingOrder.id,
                employee_id: data.employee_id || existingOrder.employee_id,
                total_amount: existingOrder.total_amount
            });
        } catch (error) {
            console.error("Failed to automatically generate invoice:", error);
        }
    }

    return await getOrderById(id);
}

export async function deleteOrder(id) {
    const affectedRows = await orderRepo.deleteOrder(id);
    if (affectedRows === 0) {
        throw new Error("Order not found");
    }
    return { message: "Order deleted successfully" };
}
