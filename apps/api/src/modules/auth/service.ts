import { AppError } from "../../lib/errors";
import { hashPassword, verifyPassword } from "../../lib/password";
import type { LoginInput, RegisterInput } from "./models/credentials";
import type { Session } from "./models/session";
import type { User } from "./models/user";
import { AuthRepository, UsernameTakenError } from "./repository";

const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

export class AuthService {
  static async register(input: RegisterInput) {
    const existing = await AuthRepository.findUserByUsername(input.username);
    if (existing) throw new AppError(409, "username_taken", "Username already taken");

    const passwordHash = await hashPassword(input.password);
    let user;
    try {
      user = await AuthRepository.insertUser({
        username: input.username,
        displayName: input.displayName,
        passwordHash,
      });
    } catch (error) {
      if (error instanceof UsernameTakenError) {
        throw new AppError(409, "username_taken", "Username already taken");
      }
      throw error;
    }

    const session = await AuthService.openSession(user.id);
    return { user: AuthService.toUser(user), session };
  }

  static async login(input: LoginInput) {
    const user = await AuthRepository.findUserByUsername(input.username);
    if (!user || !(await verifyPassword(user.passwordHash, input.password))) {
      throw new AppError(401, "invalid_credentials", "Invalid username or password");
    }

    const session = await AuthService.openSession(user.id);
    return { user: AuthService.toUser(user), session };
  }

  private static toUser(user: {
    id: string;
    username: string;
    displayName: string;
    status: User["status"];
    role: User["role"];
    createdAt: Date;
  }): User {
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private static async openSession(userId: string): Promise<Session> {
    const expiresAt = new Date(Date.now() + SESSION_MS);
    const session = await AuthRepository.insertSession(userId, expiresAt);
    return { id: session.id, expiresAt: session.expiresAt };
  }
}
