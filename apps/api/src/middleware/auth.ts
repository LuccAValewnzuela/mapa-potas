import type { Context, MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { z } from "zod";
import { AppError } from "../lib/errors";
import type { SessionUser } from "../modules/auth/models/session-user";
import { AuthRepository } from "../modules/auth/repository";

export type AuthEnv = {
  Variables: {
    user: SessionUser;
  };
};

async function sessionUser(c: Context): Promise<SessionUser> {
  const sessionId = getCookie(c, "session");
  if (!sessionId || !z.uuid().safeParse(sessionId).success) {
    throw new AppError(401, "unauthorized", "Login required");
  }

  const row = await AuthRepository.findSessionUser(sessionId);
  if (!row || row.expiresAt <= new Date()) {
    throw new AppError(401, "unauthorized", "Login required");
  }

  return {
    id: row.id,
    username: row.username,
    displayName: row.displayName,
    status: row.status,
    role: row.role,
  };
}

export const requireUser: MiddlewareHandler<AuthEnv> = async (c, next) => {
  c.set("user", await sessionUser(c));
  await next();
};

export const requireAdmin: MiddlewareHandler<AuthEnv> = async (c, next) => {
  const user = await sessionUser(c);
  if (user.role !== "admin" || user.status !== "active") {
    throw new AppError(403, "forbidden", "Admin only");
  }
  c.set("user", user);
  await next();
};
