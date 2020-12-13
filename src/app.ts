import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import { SESSION_SECRET } from "./config/secret";
import controllers from "./controllers";

// Create Express Server
const app = express();

const API_VERSION = process.env["API_VERSION"] || "v1";

// Configure Express
app.set("port", process.env.PORT || 1847);
// Compress request as well as response
app.use(compression());
// Parse request as json
app.use(bodyParser.json());
// Return middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: SESSION_SECRET,
    })
);
app.use("/", express.static(path.join(__dirname, "../public")));
// Express 框架
app.use(`/${API_VERSION}/image`, controllers.imageRouter);
app.use(`/${API_VERSION}/douban`, controllers.doubanRouter);

export default app;
