import { AppError } from "../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findCustomerByUsername,
  createCustomer,
  findEmployeeByUsername,
} from "./auth.repository.js";

const SALT_ROUNDS = 10;

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

export async function registerCustomer(data) {
  const { fullName, username, password, phone, email, address } = data;

  if (!fullName || !username || !password || !phone) {
    throw new Error("Full name, username, password and phone are required");
  }

  const existingCustomer = await findCustomerByUsername(username);

  if (existingCustomer) {
    throw new AppError("Username already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const customerId = await createCustomer({
    fullName,
    username,
    password: hashedPassword,
    phone,
    email: email || null,
    address: address || null,
  });

  return {
    id: customerId,
    username,
  };
}

export async function loginCustomer(username, password) {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  const customer = await findCustomerByUsername(username);

  if (!customer) {
    throw new Error("Invalid username or password");
  }

  const passwordMatched = await bcrypt.compare(password, customer.password);

  if (!passwordMatched) {
    throw new Error("Invalid username or password");
  }

  const token = generateToken({
    userId: customer.id,
    userType: "CUSTOMER",
  });

  return {
    token,
    user: {
      id: customer.id,
      fullName: customer.full_name,
      username: customer.username,
      type: "CUSTOMER",
    },
  };
}

export async function loginEmployee(username, password) {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  const employee = await findEmployeeByUsername(username);

  if (!employee) {
    throw new Error("Invalid username or password");
  }

  if (employee.status !== "ACTIVE") {
    throw new Error("Employee account is inactive");
  }

  const passwordMatched = await bcrypt.compare(password, employee.password);

  if (!passwordMatched) {
    throw new Error("Invalid username or password");
  }

  const token = generateToken({
    userId: employee.id,
    userType: "EMPLOYEE",
    role: employee.role_name,
  });

  return {
    token,
    user: {
      id: employee.id,
      fullName: employee.full_name,
      username: employee.username,
      type: "EMPLOYEE",
      role: employee.role_name,
    },
  };
}
