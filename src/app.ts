import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import { swaggerDocumentation } from "./config/swagger";

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, "http://localhost:3001"]
    : ["http://localhost:3001"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

app.use("/api", routes);

export default app;