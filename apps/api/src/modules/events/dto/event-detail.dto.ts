import type { CommentDto } from "./comment.dto";
import type { EventDto } from "./event.dto";

export type EventDetailDto = EventDto & {
  comments: CommentDto[];
  photoIds: string[];
};
