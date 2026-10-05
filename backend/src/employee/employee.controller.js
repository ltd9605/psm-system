import * as employeeService from "./employee.service.js";

export async function getEmployees(req, res) {
    try {
        const filters = req.query;
        const employees = await employeeService.getEmployees(filters);
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getEmployeeById(req, res) {
    try {
        const { id } = req.params;
        const employee = await employeeService.getEmployeeById(id);
        res.status(200).json(employee);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function createEmployee(req, res) {
    try {
        const employee = await employeeService.createEmployee(req.body);
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateEmployee(req, res) {
    try {
        const { id } = req.params;
        const employee = await employeeService.updateEmployee(id, req.body);
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteEmployee(req, res) {
    try {
        const { id } = req.params;
        const result = await employeeService.deleteEmployee(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
