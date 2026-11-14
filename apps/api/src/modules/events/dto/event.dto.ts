export type EventDto = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  latitude: number;
  longitude: number;
  occurredAt: Date;
  note: string | null;
  createdAt: Date;
};
