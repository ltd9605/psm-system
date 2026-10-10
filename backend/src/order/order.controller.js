import * as orderService from "./order.service.js";

export async function getOrders(req, res) {
  const filters = req.query;
  const orders = await orderService.getOrders(filters);
  res.status(200).json(orders);
}

export async function getOrderStats(req, res) {
  const filters = req.query;
  const stats = await orderService.getOrderStats(filters);
  res.status(200).json(stats);
}

export async function getOrderById(req, res) {
  const { id } = req.params;
  const order = await orderService.getOrderById(id);
  res.status(200).json(order);
}

export async function createOrder(req, res) {
  const order = await orderService.createOrder(req.body);
  res.status(201).json(order);
}

export async function updateOrder(req, res) {
  const { id } = req.params;
  const order = await orderService.updateOrder(id, req.body);
  res.status(200).json(order);
}

export async function deleteOrder(req, res) {
  const { id } = req.params;
  const result = await orderService.deleteOrder(id);
  res.status(200).json(result);
}

export async function approveOrder(req, res) {
  const { id } = req.params;
  const employeeId = req.user.userId;
  const order = await orderService.updateOrder(id, {
    status: "CONFIRMED",
    employee_id: employeeId,
  });
  res.status(200).json({ message: "Order approved successfully", order });
}

export async function completeOrder(req, res) {
  const { id } = req.params;
  const employeeId = req.user.userId;
  const order = await orderService.updateOrder(id, {
    status: "COMPLETED",
    employee_id: employeeId,
  });
  res
    .status(200)
    .json({
      message: "Order completed and invoice generated successfully",
      order,
    });
}

export async function cancelOrder(req, res) {
  const { id } = req.params;
  const employeeId = req.user.userId;
  const order = await orderService.updateOrder(id, {
    status: "CANCELLED",
    employee_id: employeeId,
  });
  res.status(200).json({ message: "Order cancelled successfully", order });
}
