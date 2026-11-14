import { AppError } from "../../lib/errors";
import type { SessionUser } from "../auth/models/session-user";
import type { CreateCommentInput, CreateEventInput, UpdateEventInput } from "./models/event-input";
import type { EventQuery } from "./models/event-query";
import { EventsRepository } from "./repository";

export class EventsService {
  static async getEvents(query: EventQuery) {
    return EventsRepository.getEvents(query);
  }

  static async getEventById(id: string) {
    const [event] = await EventsRepository.getEvents({ id });
    if (!event) throw new AppError(404, "event_not_found", "Event not found");
    return event;
  }

  static async getEventDetail(id: string) {
    const event = await EventsService.getEventById(id);
    const [comments, photoIds] = await Promise.all([
      EventsRepository.getCommentsByEventId(id),
      EventsRepository.getPhotoIdsByEventId(id),
    ]);

    return { ...event, comments, photoIds };
  }

  static async createEvent(eventData: CreateEventInput) {
    const result = await EventsRepository.createEvent(eventData);
    if (!result) throw new AppError(500, "internal_error", "Could not create event");

    return EventsService.getEventById(result.id);
  }

  static async updateEvent(eventId: string, actor: SessionUser, updatedEvent: UpdateEventInput) {
    const event = await EventsService.getEventById(eventId);
    if (event.userId !== actor.id) {
      throw new AppError(403, "forbidden", "You can only edit your own events");
    }

    const updated = await EventsRepository.updateEvent(eventId, updatedEvent);
    if (!updated) throw new AppError(404, "event_not_found", "Event not found");

    return EventsService.getEventById(eventId);
  }

  static async deleteEvent(eventId: string, actor: SessionUser) {
    const event = await EventsService.getEventById(eventId);
    if (event.userId !== actor.id) {
      throw new AppError(403, "forbidden", "You can only delete your own events");
    }

    const deleted = await EventsRepository.deleteEvent(eventId);
    if (!deleted) throw new AppError(404, "event_not_found", "Event not found");
  }

  static async createComment(commentData: CreateCommentInput) {
    await EventsService.getEventById(commentData.eventId);

    const result = await EventsRepository.createComment(commentData);
    if (!result) throw new AppError(500, "internal_error", "Could not create comment");

    const comment = await EventsRepository.getCommentById(result.id);
    if (!comment) throw new AppError(500, "internal_error", "Could not create comment");

    return comment;
  }

  static async deleteComment(commentId: string, actor: SessionUser) {
    const comment = await EventsRepository.getCommentById(commentId);
    if (!comment) throw new AppError(404, "comment_not_found", "Comment not found");

    if (comment.userId !== actor.id && actor.role !== "admin") {
      throw new AppError(403, "forbidden", "You can not delete this comment");
    }

    const deleted = await EventsRepository.deleteComment(commentId);
    if (!deleted) throw new AppError(404, "comment_not_found", "Comment not found");
  }
}
