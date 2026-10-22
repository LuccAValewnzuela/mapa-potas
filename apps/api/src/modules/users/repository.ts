import { and, asc, eq, type SQL } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import type { UserQuery } from "./models/user-query";

const userColumns = {
  id: users.id,
  username: users.username,
  displayName: users.displayName,
  avatarKey: users.avatarKey,
  status: users.status,
  role: users.role,
  createdAt: users.createdAt,
  reviewedAt: users.reviewedAt,
  reviewedBy: users.reviewedBy,
};

export class UsersRepository {
  static async getUsers(query: UserQuery = {}) {
    const filters: SQL[] = [];
    if (query.id) filters.push(eq(users.id, query.id));
    if (query.username) filters.push(eq(users.username, query.username));
    if (query.status) filters.push(eq(users.status, query.status));
    if (query.role) filters.push(eq(users.role, query.role));

    return db
      .select(userColumns)
      .from(users)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(asc(users.username));
  }

  static async reviewUser(id: string, status: "active" | "rejected", reviewedBy: string) {
    const [user] = await db
      .update(users)
      .set({ status, reviewedAt: new Date(), reviewedBy })
      .where(eq(users.id, id))
      .returning(userColumns);
    return user;
  }
}
