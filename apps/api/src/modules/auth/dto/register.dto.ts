import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]{3,20}$/, "Username must be 3-20 characters: a-z, 0-9, _"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  displayName: z.string().trim().min(1).max(40),
});

export type RegisterDto = z.infer<typeof registerSchema>;
