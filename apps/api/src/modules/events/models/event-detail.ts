import type { Comment } from "./comment";
import type { Event } from "./event";

export type EventDetail = Event & {
  comments: Comment[];
  photoIds: string[];
};
