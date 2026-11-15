import { and, asc, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "../../db";
import { comments, events, photos, places, users } from "../../db/schema";
import type { CreateCommentInput, CreateEventInput, UpdateEventInput } from "./models/event-input";
import type { EventQuery } from "./models/event-query";

const commentColumns = {
  id: comments.id,
  eventId: comments.eventId,
  userId: comments.userId,
  username: users.username,
  displayName: users.displayName,
  avatarKey: users.avatarKey,
  body: comments.body,
  createdAt: comments.createdAt,
};

export class EventsRepository {
  static async getEvents(query: EventQuery & { id?: string } = {}) {
    return db
      .select({
        id: events.id,
        userId: events.userId,
        username: users.username,
        displayName: users.displayName,
        avatarKey: users.avatarKey,
        place: places,
        latitude: events.latitude,
        longitude: events.longitude,
        occurredAt: events.occurredAt,
        note: events.note,
        createdAt: events.createdAt,
      })
      .from(events)
      .innerJoin(users, eq(users.id, events.userId))
      .leftJoin(places, eq(places.id, events.placeId))
      .where(
        and(
          eq(users.status, "active"),
          query.id ? eq(events.id, query.id) : undefined,
          query.userIds && query.userIds.length > 0
            ? inArray(events.userId, query.userIds)
            : undefined,
          query.from ? gte(events.occurredAt, query.from) : undefined,
          query.to ? lte(events.occurredAt, query.to) : undefined,
        ),
      )
      .orderBy(desc(events.occurredAt));
  }

  static async createEvent(eventData: CreateEventInput) {
    const [row] = await db
      .insert(events)
      .values(eventData)
      .returning({ id: events.id });

    return row;
  }

  static async updateEvent(eventId: string, updatedEvent: UpdateEventInput) {
    const [row] = await db
      .update(events)
      .set(updatedEvent)
      .where(eq(events.id, eventId))
      .returning({ id: events.id });

    return row;
  }

  static async deleteEvent(eventId: string) {
    const [row] = await db
      .delete(events)
      .where(eq(events.id, eventId))
      .returning({ id: events.id });

    return row;
  }

  static async getCommentsByEventId(eventId: string) {
    return db
      .select(commentColumns)
      .from(comments)
      .innerJoin(users, eq(users.id, comments.userId))
      .where(and(eq(comments.eventId, eventId), eq(users.status, "active")))
      .orderBy(asc(comments.createdAt));
  }

  static async getCommentById(commentId: string) {
    const [row] = await db
      .select(commentColumns)
      .from(comments)
      .innerJoin(users, eq(users.id, comments.userId))
      .where(eq(comments.id, commentId))
      .limit(1);

    return row;
  }

  static async createComment(commentData: CreateCommentInput) {
    const [row] = await db
      .insert(comments)
      .values(commentData)
      .returning({ id: comments.id });

    return row;
  }

  static async deleteComment(commentId: string) {
    const [row] = await db
      .delete(comments)
      .where(eq(comments.id, commentId))
      .returning({ id: comments.id });

    return row;
  }

  static async getPhotoIdsByEventId(eventId: string) {
    const rows = await db
      .select({ id: photos.id })
      .from(photos)
      .where(eq(photos.eventId, eventId))
      .orderBy(asc(photos.createdAt));

    return rows.map((row) => row.id);
  }

  static async getPhotoStorageKeysByEventId(eventId: string) {
    const rows = await db
      .select({ storageKey: photos.storageKey })
      .from(photos)
      .where(eq(photos.eventId, eventId));

    return rows.map((row) => row.storageKey);
  }
}
