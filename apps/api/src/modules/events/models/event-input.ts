export type CreateEventInput = {
  userId: string;
  placeId?: string | null;
  latitude: number;
  longitude: number;
  occurredAt: Date;
  note: string | null;
};

export type UpdateEventInput = {
  latitude?: number;
  longitude?: number;
  occurredAt?: Date;
  note?: string | null;
  placeId?: string | null;
};

export type CreateCommentInput = {
  eventId: string;
  userId: string;
  body: string;
};
