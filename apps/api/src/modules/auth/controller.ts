import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import type { AuthEnv } from "../../middleware/auth";
import type { AuthUserDto } from "./dto/auth-user.dto";
import { loginSchema } from "./dto/login.dto";
import { registerSchema } from "./dto/register.dto";
import type { Session } from "./models/session";
import { AuthService } from "./service";

export class AuthController {
  static async register(c: Context<AuthEnv>) {
    const dto = registerSchema.parse(await c.req.json());
    const result = await AuthService.register({
      username: dto.username,
      password: dto.password,
      displayName: dto.displayName,
    });
    AuthController.setSessionCookie(c, result.session);
    return c.json(AuthController.toDto(result.user), 201);
  }

  static async login(c: Context<AuthEnv>) {
    const dto = loginSchema.parse(await c.req.json());
    const result = await AuthService.login({
      username: dto.username,
      password: dto.password,
    });
    AuthController.setSessionCookie(c, result.session);
    return c.json(AuthController.toDto(result.user));
  }

  static async me(c: Context<AuthEnv>) {
    return c.json(AuthController.toDto(c.get("user")));
  }

  static async logout(c: Context<AuthEnv>) {
    const sessionId = getCookie(c, "session");
    if (sessionId && z.uuid().safeParse(sessionId).success) {
      await AuthService.logout(sessionId);
    }

    deleteCookie(c, "session", { path: "/" });
    return c.body(null, 204);
  }

  private static toDto(user: {
    id: string;
    username: string;
    displayName: string;
    status: AuthUserDto["status"];
    role: AuthUserDto["role"];
    createdAt: Date;
  }): AuthUserDto {
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
    };
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
