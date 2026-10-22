import { Hono } from "hono";
import { StatsController } from "./controller";

export const statsRoutes = new Hono();

statsRoutes.get("/ranking", StatsController.getRanking);
statsRoutes.get("/users/:username", StatsController.getUserStats);
