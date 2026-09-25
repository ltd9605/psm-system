import express from "express";
import dotenv from "dotenv";
import pool from "./config/database.js";




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
export default app;