import { Router } from "express";
import { configOptions, scenarios } from "../data/dataLoader.js";

export const personaRouter = Router();

personaRouter.get("/config-options", (_req, res) => {
  res.json(configOptions);
});

personaRouter.get("/scenarios", (_req, res) => {
  res.json(scenarios);
});
