import type { Context } from "hono";
import type { AuthEnv } from "../../middleware/auth";
import { commentIdSchema } from "./dto/comment-id.dto";
import { createCommentSchema } from "./dto/create-comment.dto";
import { createEventSchema } from "./dto/create-event.dto";
import { eventIdSchema } from "./dto/event-id.dto";
import { eventQuerySchema } from "./dto/event-query.dto";
import { updateEventSchema } from "./dto/update-event.dto";
import type { Comment } from "./models/comment";
import type { Event } from "./models/event";
import type { EventDetail } from "./models/event-detail";
import { EventsService } from "./service";

export class EventsController {
  static async getEvents(c: Context<AuthEnv>) {
    const query = eventQuerySchema.parse(c.req.query());
    const events = await EventsService.getEvents(query);
    return c.json(events.map(EventsController.toEventDto));
  }

  static async getEventById(c: Context<AuthEnv>) {
    const id = eventIdSchema.parse(c.req.param("id"));
    const event = await EventsService.getEventDetail(id);
    return c.json(EventsController.toEventDetailDto(event));
  }

  static async createEvent(c: Context<AuthEnv>) {
    const dto = createEventSchema.parse(await c.req.json());
    const event = await EventsService.createEvent({
      userId: dto.userId,
      latitude: dto.latitude,
      longitude: dto.longitude,
      occurredAt: dto.occurredAt,
      note: dto.note,
    }, c.get("user"));

    return c.json(EventsController.toEventDto(event), 201);
  }

  static async updateEvent(c: Context<AuthEnv>) {
    const id = eventIdSchema.parse(c.req.param("id"));
    const dto = updateEventSchema.parse(await c.req.json());
    const event = await EventsService.updateEvent(id, c.get("user"), dto);

    return c.json(EventsController.toEventDto(event));
  }

  static async deleteEvent(c: Context<AuthEnv>) {
    const id = eventIdSchema.parse(c.req.param("id"));
    await EventsService.deleteEvent(id, c.get("user"));

    return c.body(null, 204);
  }

  static async createComment(c: Context<AuthEnv>) {
    const eventId = eventIdSchema.parse(c.req.param("id"));
    const dto = createCommentSchema.parse(await c.req.json());
    const comment = await EventsService.createComment({
      eventId,
      userId: c.get("user").id,
      body: dto.body,
    });

    return c.json(EventsController.toCommentDto(comment), 201);
  }

  static async deleteComment(c: Context<AuthEnv>) {
    const id = commentIdSchema.parse(c.req.param("id"));
    await EventsService.deleteComment(id, c.get("user"));

    return c.body(null, 204);
  }

  private static toEventDto(event: Event) {
    return {
      id: event.id,
      userId: event.userId,
      username: event.username,
      displayName: event.displayName,
      avatarKey: event.avatarKey,
      latitude: event.latitude,
      longitude: event.longitude,
      occurredAt: event.occurredAt,
      note: event.note,
      createdAt: event.createdAt,
    };
  }

  private static toEventDetailDto(event: EventDetail) {
    return {
      ...EventsController.toEventDto(event),
      comments: event.comments.map(EventsController.toCommentDto),
      photoIds: event.photoIds,
    };
  }

  private static toCommentDto(comment: Comment) {
    return {
      id: comment.id,
      eventId: comment.eventId,
      userId: comment.userId,
      username: comment.username,
      displayName: comment.displayName,
      avatarKey: comment.avatarKey,
      body: comment.body,
      createdAt: comment.createdAt,
    };
  }
}
