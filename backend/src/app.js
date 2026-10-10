import express from "express";
import dotenv from "dotenv";
import pool from "./config/database.js";

import authRoutes from "./auth/auth.routes.js";
import productRoutes from "./product/product.routes.js";
import customerRoutes from "./customer/customer.routes.js";
import employeeRoutes from "./employee/employee.routes.js";
import invoiceRoutes from "./invoice/invoice.routes.js";
import orderRoutes from "./order/order.routes.js";
import brandRoutes from "./brand/brand.routes.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.json({
        message: "Server is running",
        version: "1.0.0",
        main: "app.js",
        type: "module"
    });
});
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        const [rows] = await pool.query("SELECT 1 AS connected");
        console.log("Successfully connected to the database!");
    } catch (error) {
        console.log("Database connection failed !", error)
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/brands", brandRoutes);

setupSwagger(app);

export default app;