import { z } from "zod";

export const updateEventSchema = z
  .object({
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    occurredAt: z
      .iso.datetime({ offset: true })
      .transform((value) => new Date(value))
      .optional(),
    note: z
      .string()
      .trim()
      .max(500)
      .nullable()
      .optional()
      .transform((value) => (value === "" ? null : value)),
    placeId: z.uuid().nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export type UpdateEventDto = z.infer<typeof updateEventSchema>;
