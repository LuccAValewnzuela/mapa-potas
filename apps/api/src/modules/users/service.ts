import { AppError } from "../../lib/errors";
import type { User } from "./models/user";
import type { UserQuery } from "./models/user-query";
import { UsersRepository } from "./repository";

export class UsersService {
  static async getUsers(query: UserQuery = {}): Promise<User[]> {
    return UsersRepository.getUsers(query);
  }

  static async getByUsername(username: string): Promise<User> {
    const [user] = await UsersRepository.getUsers({
      username: username.toLowerCase(),
      status: "active",
    });
    if (!user) throw new AppError(404, "user_not_found", "User not found");
    return user;
  }

  static async approve(id: string, reviewerId: string) {
    return UsersService.review(id, "active", reviewerId);
  }

  static async reject(id: string, reviewerId: string) {
    return UsersService.review(id, "rejected", reviewerId);
  }

  private static async review(id: string, status: "active" | "rejected", reviewerId: string): Promise<User> {
    const user = await UsersRepository.reviewUser(id, status, reviewerId);
    if (!user) throw new AppError(404, "user_not_found", "User not found");
    return user;
  }
}
