export type CommentDto = {
  id: string;
  eventId: string;
  userId: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  body: string;
  createdAt: Date;
};
