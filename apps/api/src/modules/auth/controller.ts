import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { loginSchema } from "./dto/login.dto";
import { registerSchema } from "./dto/register.dto";
import type { Session } from "./models/session";
import { AuthService } from "./service";

export class AuthController {
  static async register(c: Context) {
    const body = registerSchema.parse(await c.req.json());
    const result = await AuthService.register(body);
    AuthController.setSessionCookie(c, result.session);
    return c.json(result.user, 201);
  }

  static async login(c: Context) {
    const body = loginSchema.parse(await c.req.json());
    const result = await AuthService.login(body);
    AuthController.setSessionCookie(c, result.session);
    return c.json(result.user);
  }

  private static setSessionCookie(c: Context, session: Session) {
    setCookie(c, "session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      expires: session.expiresAt,
    });
  }
}
