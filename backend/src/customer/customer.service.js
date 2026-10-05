import * as customerRepo from "./customer.repository.js";

export async function getCustomers(filters) {
    return await customerRepo.findCustomers(filters);
}

export async function getCustomerById(id) {
    const customer = await customerRepo.findCustomerById(id);
    if (!customer) {
        throw new Error("Customer not found");
    }
    return customer;
}

export async function createCustomer(data) {
    const newId = await customerRepo.createCustomer(data);
    return await getCustomerById(newId);
}

export async function updateCustomer(id, data) {
    const affectedRows = await customerRepo.updateCustomer(id, data);
    if (affectedRows === 0) {
        throw new Error("Customer not found or no changes made");
    }
    return await getCustomerById(id);
}

export async function deleteCustomer(id) {
    const affectedRows = await customerRepo.deleteCustomer(id);
    if (affectedRows === 0) {
        throw new Error("Customer not found");
    }
    return { message: "Customer deleted successfully" };
}
