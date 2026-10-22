import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]{3,20}$/, "Username must be 3-20 characters: a-z, 0-9, _"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export type LoginDto = z.infer<typeof loginSchema>;
