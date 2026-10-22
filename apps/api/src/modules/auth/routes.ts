import { Hono } from "hono";
import { AuthController } from "./controller";

export const authRoutes = new Hono();

authRoutes.post("/register", AuthController.register);
authRoutes.post("/login", AuthController.login);
