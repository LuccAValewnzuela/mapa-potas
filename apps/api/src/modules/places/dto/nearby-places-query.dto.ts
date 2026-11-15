import { z } from "zod";

export const nearbyPlacesQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(1).max(1000).default(75),
});

export type NearbyPlacesQueryDto = z.infer<typeof nearbyPlacesQuerySchema>;
