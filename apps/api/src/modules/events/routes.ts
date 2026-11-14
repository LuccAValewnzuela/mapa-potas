import { Hono } from "hono";
import { type AuthEnv, requireActiveUser } from "../../middleware/auth";
import { EventsController } from "./controller";

export const eventsRoutes = new Hono<AuthEnv>();

eventsRoutes.get("/", EventsController.getEvents);
eventsRoutes.get("/:id", EventsController.getEventById);
eventsRoutes.post("/", requireActiveUser, EventsController.createEvent);
eventsRoutes.post("/:id/comments", requireActiveUser, EventsController.createComment);
eventsRoutes.patch("/:id", requireActiveUser, EventsController.updateEvent);
eventsRoutes.delete("/:id", requireActiveUser, EventsController.deleteEvent);

export const commentsRoutes = new Hono<AuthEnv>();

commentsRoutes.delete("/:id", requireActiveUser, EventsController.deleteComment);
