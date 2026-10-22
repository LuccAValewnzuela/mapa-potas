import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import type { AuthUserDto } from "./dto/auth-user.dto";
import { loginSchema } from "./dto/login.dto";
import { registerSchema } from "./dto/register.dto";
import type { Session } from "./models/session";
import type { User } from "./models/user";
import { AuthService } from "./service";

export class AuthController {
  static async register(c: Context) {
    const dto = registerSchema.parse(await c.req.json());
    const result = await AuthService.register({
      username: dto.username,
      password: dto.password,
      displayName: dto.displayName,
    });
    AuthController.setSessionCookie(c, result.session);
    return c.json(AuthController.toDto(result.user), 201);
  }

  static async login(c: Context) {
    const dto = loginSchema.parse(await c.req.json());
    const result = await AuthService.login({
      username: dto.username,
      password: dto.password,
    });
    AuthController.setSessionCookie(c, result.session);
    return c.json(AuthController.toDto(result.user));
  }

  private static toDto(user: User): AuthUserDto {
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
