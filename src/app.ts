import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import { swaggerDocumentation } from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

app.use("/api", routes);

export default app;