import { AppError } from "../utils/AppError.js";
import * as employeeRepo from "./employee.repository.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function getEmployees(filters) {
  return await employeeRepo.findEmployees(filters);
}

export async function getEmployeeById(id) {
  const employee = await employeeRepo.findEmployeeById(id);
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }
  return employee;
}

export async function createEmployee(data) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }
  const newId = await employeeRepo.createEmployee(data);
  return await getEmployeeById(newId);
}

export async function updateEmployee(id, data) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }
  const affectedRows = await employeeRepo.updateEmployee(id, data);
  if (affectedRows === 0) {
    throw new AppError("Employee not found or no changes made", 404);
  }
  return await getEmployeeById(id);
}

export async function deleteEmployee(id) {
  const affectedRows = await employeeRepo.softDeleteEmployee(id);
  if (affectedRows === 0) {
    throw new AppError("Employee not found", 404);
  }
  return { message: "Employee deleted (soft deleted) successfully" };
}
