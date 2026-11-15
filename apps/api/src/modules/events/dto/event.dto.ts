import type { Place } from "../../places/models/place";

export type EventDto = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  place: Place | null;
  latitude: number;
  longitude: number;
  occurredAt: Date;
  note: string | null;
  createdAt: Date;
};
