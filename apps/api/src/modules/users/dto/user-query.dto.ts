import { z } from "zod";

export const userQuerySchema = z.object({
  status: z.enum(["pending", "active", "rejected"]).optional(),
  role: z.enum(["member", "admin"]).optional(),
});

export type UserQueryDto = z.infer<typeof userQuerySchema>;
