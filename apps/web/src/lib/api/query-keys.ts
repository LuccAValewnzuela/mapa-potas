import type { AdminUserQuery, EventQuery } from "./types";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (username: string) => ["users", username] as const,
  },
  events: {
    all: ["events"] as const,
    list: (query: EventQuery) => ["events", "list", query] as const,
    detail: (id: string) => ["events", "detail", id] as const,
  },
  comments: {
    all: ["comments"] as const,
  },
  photos: {
    all: ["photos"] as const,
  },
  stats: {
    ranking: ["stats", "ranking"] as const,
    user: (username: string) => ["stats", "user", username] as const,
  },
  admin: {
    users: (query: AdminUserQuery) => ["admin", "users", query] as const,
  },
};
