import { Hono } from "hono";
import { type AuthEnv, requireUser } from "../../middleware/auth";
import { AuthController } from "./controller";

export const authRoutes = new Hono<AuthEnv>();

authRoutes.post("/register", AuthController.register);
authRoutes.post("/login", AuthController.login);
authRoutes.post("/logout", AuthController.logout);
authRoutes.get("/me", requireUser, AuthController.me);
