export type UserStatus = "pending" | "active" | "rejected";

export type UserRole = "member" | "admin";

export type AuthUser = {
  id: string;
  username: string;
  displayName: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
};

export type User = {
  id: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
};

export type Event = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  latitude: number;
  longitude: number;
  occurredAt: string;
  note: string | null;
  createdAt: string;
};

export type Comment = {
  id: string;
  eventId: string;
  userId: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  body: string;
  createdAt: string;
};

export type EventDetail = Event & {
  comments: Comment[];
  photoIds: string[];
};

export type Photo = {
  id: string;
  eventId: string;
  uploadedBy: string;
  mimeType: string;
  createdAt: string;
  url: string;
};

export type UserStats = {
  id: string;
  username: string;
  displayName: string;
  total: number;
  month: number;
  lastEventAt: string | null;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  password: string;
  displayName: string;
};

export type EventQuery = {
  userIds?: string[];
  from?: string;
  to?: string;
};

export type CreateEventInput = {
  userId: string;
  latitude: number;
  longitude: number;
  occurredAt: string;
  note?: string | null;
};

export type UpdateEventInput = {
  latitude?: number;
  longitude?: number;
  occurredAt?: string;
  note?: string | null;
};

export type CreateCommentInput = {
  body: string;
};

export type AdminUserQuery = {
  status?: UserStatus;
  role?: UserRole;
};
