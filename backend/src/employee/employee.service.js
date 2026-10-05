import * as employeeRepo from "./employee.repository.js";

export async function getEmployees(filters) {
    return await employeeRepo.findEmployees(filters);
}

export async function getEmployeeById(id) {
    const employee = await employeeRepo.findEmployeeById(id);
    if (!employee) {
        throw new Error("Employee not found");
    }
    return employee;
}

export async function createEmployee(data) {
    const newId = await employeeRepo.createEmployee(data);
    return await getEmployeeById(newId);
}

export async function updateEmployee(id, data) {
    const affectedRows = await employeeRepo.updateEmployee(id, data);
    if (affectedRows === 0) {
        throw new Error("Employee not found or no changes made");
    }
    return await getEmployeeById(id);
}

export async function deleteEmployee(id) {
    const affectedRows = await employeeRepo.softDeleteEmployee(id);
    if (affectedRows === 0) {
        throw new Error("Employee not found");
    }
    return { message: "Employee deleted (soft deleted) successfully" };
}
