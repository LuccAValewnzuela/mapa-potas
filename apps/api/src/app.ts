import { Hono } from "hono";
import { ZodError } from "zod";
import { AppError } from "./lib/errors";
import { authRoutes } from "./modules/auth/routes";

export const app = new Hono();

app.route("/auth", authRoutes);

app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: { code: err.code, message: err.message } }, err.status as 400);
  }
  if (err instanceof ZodError) {
    return c.json(
      { error: { code: "validation_error", message: err.issues[0]?.message ?? "Invalid input" } },
      400,
    );
  }
  if (err instanceof SyntaxError) {
    return c.json({ error: { code: "invalid_json", message: "Invalid JSON" } }, 400);
  }
  console.error(err);
  return c.json({ error: { code: "internal_error", message: "Internal error" } }, 500);
});
