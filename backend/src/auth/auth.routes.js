import express from "express";

import {
    customerRegister,
    customerLogin,
    employeeLogin
} from "./auth.controller.js";

const router = express.Router();

router.post(
    "/customer/register",
    customerRegister
);

router.post(
    "/customer/login",
    customerLogin,
);

router.post(
    "/employee/login",
    employeeLogin
);

export default router;