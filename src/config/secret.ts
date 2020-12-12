import dotenv from "dotenv";
import fs from "fs";

// read env configuration
if (fs.existsSync(".env")) {
    dotenv.config({ path: ".env" });
}
// current node enviroment string
export const ENVIRONMENT = process.env.NODE_ENV || "";

const isProduction = ENVIRONMENT === "production";

export const SESSION_SECRET = process.env["SESSION_SECRET"] || "";

if (!SESSION_SECRET) {
    process.exit(1);
}
