import { eq } from "drizzle-orm";
import { db } from "../../db";
import { sessions, users } from "../../db/schema";
import { isUniqueViolation } from "../../lib/errors";

export class UsernameTakenError extends Error {}

export class AuthRepository {

  static async findUserByUsername(username: string) {
    return await db.select().from(users).where(eq(users.username, username)).limit(1).then((rows) => rows[0]);
  }

  static async insertUser(input: { username: string; displayName: string; passwordHash: string }) {
    try {
      const [user] = await db
        .insert(users)
        .values({
          username: input.username,
          displayName: input.displayName,
          passwordHash: input.passwordHash,
        })
        .returning();
      return user;
    } catch (error) {
      if (isUniqueViolation(error)) throw new UsernameTakenError();
      throw error;
    }
  }

  static async insertSession(userId: string, expiresAt: Date) {
    const [session] = await db.insert(sessions).values({ userId, expiresAt }).returning();
    return session;
  }

  static async findSessionUser(sessionId: string) {
    const [row] = await db
      .select({
        expiresAt: sessions.expiresAt,
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        status: users.status,
        role: users.role,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))
      .limit(1);
    return row;
  }
}
