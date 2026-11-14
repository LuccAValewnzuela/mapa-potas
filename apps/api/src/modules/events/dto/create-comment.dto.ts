import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.string().trim().min(1, "Comment cannot be empty").max(1000),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
