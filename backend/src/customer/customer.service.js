import { AppError } from "../utils/AppError.js";
import * as customerRepo from "./customer.repository.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function getCustomers(filters) {
  return await customerRepo.findCustomers(filters);
}

export async function getCustomerById(id) {
  const customer = await customerRepo.findCustomerById(id);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }
  return customer;
}

export async function createCustomer(data) {
  const newId = await customerRepo.createCustomer(data);
  return await getCustomerById(newId);
}

export async function updateCustomer(id, data) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }
  const affectedRows = await customerRepo.updateCustomer(id, data);
  if (affectedRows === 0) {
    throw new AppError("Customer not found or no changes made", 404);
  }
  return await getCustomerById(id);
}

export async function deleteCustomer(id) {
  const affectedRows = await customerRepo.deleteCustomer(id);
  if (affectedRows === 0) {
    throw new AppError("Customer not found", 404);
  }
  return { message: "Customer deleted successfully" };
}

export async function addProductToCart(customerId, productId, quantity) {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  if (quantity <= 0) {
    throw new AppError("Quantity must be greater than 0", 400);
  }

  let cart = await customerRepo.getCartByCustomerId(customerId);
  let cartId;
  if (!cart) {
    cartId = await customerRepo.createCart(customerId);
  } else {
    cartId = cart.id;
  }

  const existingItem = await customerRepo.getCartItem(cartId, productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    await customerRepo.updateCartItemQuantity(existingItem.id, newQuantity);
    return {
      message: "Cart item quantity updated",
      cartId,
      productId,
      quantity: newQuantity,
    };
  } else {
    await customerRepo.addCartItem(cartId, productId, quantity);
    return { message: "Product added to cart", cartId, productId, quantity };
  }
}

export async function updateCartItem(customerId, productId, quantity) {
  if (quantity <= 0) {
    throw new AppError("Quantity must be greater than 0", 400);
  }
  const cart = await customerRepo.getCartByCustomerId(customerId);
  if (!cart) throw new AppError("Cart not found", 404);

  const existingItem = await customerRepo.getCartItem(cart.id, productId);
  if (!existingItem) throw new AppError("Product not in cart", 400);

  await customerRepo.updateCartItemQuantity(existingItem.id, quantity);
  return { message: "Cart item quantity updated", productId, quantity };
}

export async function removeCartItem(customerId, productId) {
  const cart = await customerRepo.getCartByCustomerId(customerId);
  if (!cart) throw new AppError("Cart not found", 404);

  const existingItem = await customerRepo.getCartItem(cart.id, productId);
  if (!existingItem) throw new AppError("Product not in cart", 400);

  await customerRepo.removeCartItem(existingItem.id);
  return { message: "Product removed from cart successfully" };
}

export async function getCart(customerId) {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  let cart = await customerRepo.getCartWithItems(customerId);
  if (!cart) {
    const cartId = await customerRepo.createCart(customerId);
    return {
      id: cartId,
      customer_id: customerId,
      items: [],
      total_amount: 0,
    };
  }

  cart.total_amount = cart.items.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );
  return cart;
}

export async function checkout(customerId, data) {
  const customer = await getCustomerById(customerId);
  if (!customer) throw new AppError("Customer not found", 404);

  const cart = await customerRepo.getCartWithItems(customerId);
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  const { shipping_address } = data;
  const orderId = await customerRepo.createOrderFromCart(
    customer,
    cart,
    shipping_address,
  );
  return { message: "Checkout successful", orderId };
}

export async function cancelOrder(customerId, orderId) {
  await customerRepo.cancelCustomerOrder(customerId, orderId);
  return { message: "Order cancelled successfully" };
}

export async function getOrders(customerId, status) {
  const customer = await getCustomerById(customerId);
  if (!customer) throw new AppError("Customer not found", 404);

  return await customerRepo.getCustomerOrders(customerId, status);
}

export async function getOrderById(customerId, orderId) {
  const customer = await getCustomerById(customerId);
  if (!customer) throw new AppError("Customer not found", 404);

  const order = await customerRepo.getCustomerOrderById(customerId, orderId);
  if (!order) {
    throw new AppError(
      "Order not found or does not belong to this customer",
      404,
    );
  }
  return order;
}
