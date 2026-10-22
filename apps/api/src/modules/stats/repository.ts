import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { events, users } from "../../db/schema";

export class StatsRepository {
  static async getUserStats(query: { username?: string } = {}) {
    return db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        total: sql<number>`(count(${events.id}))::int`,
        month: sql<number>`(count(${events.id}) filter (where ${events.occurredAt} >= date_trunc('month', timezone('utc', now()))))::int`,
        lastEventAt: sql<Date | null>`max(${events.occurredAt})`.mapWith(events.occurredAt),
      })
      .from(users)
      .leftJoin(events, eq(events.userId, users.id))
      .where(
        and(
          eq(users.status, "active"),
          query.username ? eq(users.username, query.username) : undefined,
        ),
      )
      .groupBy(users.id, users.username, users.displayName)
      .orderBy(
        desc(sql`count(${events.id})`),
        desc(sql`max(${events.occurredAt})`),
        asc(users.username),
      );
  }
}
