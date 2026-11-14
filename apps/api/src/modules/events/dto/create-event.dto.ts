import { z } from "zod";

export const createEventSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  occurredAt: z.iso.datetime({ offset: true }).transform((value) => new Date(value)),
  note: z
    .string()
    .trim()
    .max(500)
    .nullish()
    .transform((value) => value || null),
  userId: z
  .string()
  .transform(value => value?.trim())
  .pipe(z.uuid().max(100))
});

export type CreateEventDto = z.infer<typeof createEventSchema>;
