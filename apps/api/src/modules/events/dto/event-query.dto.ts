import { z } from "zod";

const dateOnly = /^\d{4}-\d{2}-\d{2}$/;

function dateBound(edge: "start" | "end") {
  return z
    .union([z.iso.date(), z.iso.datetime({ offset: true })])
    .transform((value) => {
      const date = new Date(value);
      if (edge === "end" && dateOnly.test(value)) {
        date.setUTCHours(23, 59, 59, 999);
      }
      return date;
    });
}

export const eventQuerySchema = z
  .object({
    userIds: z
      .string()
      .optional()
      .transform((value) => value?.split(",").map((id) => id.trim()).filter(Boolean))
      .pipe(z.array(z.uuid()).max(100).optional()),
    from: dateBound("start").optional(),
    to: dateBound("end").optional(),
  })
  .refine((value) => !value.from || !value.to || value.from <= value.to, {
    message: "from must be before or equal to to",
  })
  .refine((value) => (value.from === undefined) === (value.to === undefined), {
    message: "both from and to must be provided together",
  });

export type EventQueryDto = z.infer<typeof eventQuerySchema>;
