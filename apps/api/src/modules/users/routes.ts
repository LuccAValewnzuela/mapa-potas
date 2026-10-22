import { Hono } from "hono";
import { type AuthEnv, requireAdmin } from "../../middleware/auth";
import { UsersController } from "./controller";

export const userRoutes = new Hono();

userRoutes.get("/", UsersController.getUsers);
userRoutes.get("/:username", UsersController.getByUsername);

export const adminUserRoutes = new Hono<AuthEnv>();

adminUserRoutes.use(requireAdmin);
adminUserRoutes.get("/", UsersController.getAdminUsers);
adminUserRoutes.post("/:id/approve", UsersController.approve);
adminUserRoutes.post("/:id/reject", UsersController.reject);
