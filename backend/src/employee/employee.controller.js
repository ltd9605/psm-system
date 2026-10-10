import * as employeeService from "./employee.service.js";

export async function getEmployees(req, res) {
  const filters = req.query;
  const employees = await employeeService.getEmployees(filters);
  res.status(200).json(employees);
}

export async function getEmployeeById(req, res) {
  const { id } = req.params;
  const employee = await employeeService.getEmployeeById(id);
  res.status(200).json(employee);
}

export async function createEmployee(req, res) {
  const employee = await employeeService.createEmployee(req.body);
  res.status(201).json(employee);
}

export async function updateEmployee(req, res) {
  const { id } = req.params;
  const employee = await employeeService.updateEmployee(id, req.body);
  res.status(200).json(employee);
}

export async function deleteEmployee(req, res) {
  const { id } = req.params;
  const result = await employeeService.deleteEmployee(id);
  res.status(200).json(result);
}
