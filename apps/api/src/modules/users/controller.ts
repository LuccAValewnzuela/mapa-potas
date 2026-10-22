import type { Context } from "hono";
import type { AuthEnv } from "../../middleware/auth";
import { userIdSchema } from "./dto/user-id.dto";
import { userQuerySchema } from "./dto/user-query.dto";
import type { UserDto } from "./dto/user.dto";
import type { User } from "./models/user";
import { UsersService } from "./service";

export class UsersController {
  static async getUsers(c: Context) {
    const users = await UsersService.getUsers({ status: "active" });
    return c.json(users.map(UsersController.toDto));
  }

  static async getByUsername(c: Context) {
    const user = await UsersService.getByUsername(c.req.param("username") ?? "");
    return c.json(UsersController.toDto(user));
  }

  static async getAdminUsers(c: Context) {
    const dto = userQuerySchema.parse(c.req.query());
    const users = await UsersService.getUsers({
      status: dto.status,
      role: dto.role,
    });
    return c.json(users.map(UsersController.toDto));
  }

  static async approve(c: Context<AuthEnv>) {
    const user = await UsersService.approve(userIdSchema.parse(c.req.param("id")), c.get("user").id);
    return c.json(UsersController.toDto(user));
  }

  static async reject(c: Context<AuthEnv>) {
    const user = await UsersService.reject(userIdSchema.parse(c.req.param("id")), c.get("user").id);
    return c.json(UsersController.toDto(user));
  }

  private static toDto(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarKey: user.avatarKey,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      reviewedAt: user.reviewedAt,
      reviewedBy: user.reviewedBy,
    };
  }
}
