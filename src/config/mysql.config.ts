import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10", 10),
});

export default pool;
