import { z } from "zod";

export const createPlaceSchema = z.object({
  name: z.string().trim().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type CreatePlaceDto = z.infer<typeof createPlaceSchema>;
