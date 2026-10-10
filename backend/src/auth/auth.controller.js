import {
  registerCustomer,
  loginCustomer,
  loginEmployee,
} from "./auth.service.js";

export async function customerRegister(req, res) {
  try {
    const result = await registerCustomer(req.body);

    return res.status(201).json({
      message: "Register successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function customerLogin(req, res) {
  try {
    const { username, password } = req.body;

    const result = await loginCustomer(username, password);

    return res.status(200).json({
      message: "Login successfully",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}

export async function employeeLogin(req, res) {
  try {
    const { username, password } = req.body;

    const result = await loginEmployee(username, password);

    return res.status(200).json({
      message: "Login successfully",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}
