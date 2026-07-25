import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/health.routes.js";
import { personaRouter } from "./routes/persona.routes.js";
import { sessionRouter } from "./routes/session.routes.js";


const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: "2mb" }));

app.use("/api", healthRouter);
app.use("/api", personaRouter);
app.use("/api", sessionRouter);


app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Eubrics AI Sales Arena backend running on http://localhost:${env.PORT}`);
});
