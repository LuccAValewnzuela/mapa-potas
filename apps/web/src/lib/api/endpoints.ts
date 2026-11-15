import { api, toQueryString } from "./client";
import type {
  AdminUserQuery,
  AuthUser,
  Comment,
  CreateCommentInput,
  CreateEventInput,
  CreatePlaceInput,
  Event,
  EventDetail,
  EventQuery,
  LoginInput,
  Photo,
  Place,
  RegisterInput,
  UpdateEventInput,
  User,
  UserStats,
} from "./types";

export const authApi = {
  me: () => api.get<AuthUser>("/auth/me"),
  login: (input: LoginInput) => api.post<AuthUser>("/auth/login", input),
  register: (input: RegisterInput) => api.post<AuthUser>("/auth/register", input),
  logout: () => api.post<void>("/auth/logout"),
};

export const usersApi = {
  list: () => api.get<User[]>("/users"),
  getByUsername: (username: string) =>
    api.get<User>(`/users/${encodeURIComponent(username)}`),
  adminList: (query: AdminUserQuery = {}) =>
    api.get<User[]>(`/admin/users${toQueryString(query)}`),
  approve: (id: string) =>
    api.post<User>(`/admin/users/${encodeURIComponent(id)}/approve`),
  reject: (id: string) =>
    api.post<User>(`/admin/users/${encodeURIComponent(id)}/reject`),
};

export const eventsApi = {
  list: (query: EventQuery = {}) =>
    api.get<Event[]>(
      `/events${toQueryString({
        userIds: query.userIds,
        from: query.from,
        to: query.to,
      })}`,
    ),
  get: (id: string) => api.get<EventDetail>(`/events/${encodeURIComponent(id)}`),
  create: (input: CreateEventInput) => api.post<Event>("/events", input),
  update: (id: string, input: UpdateEventInput) =>
    api.patch<Event>(`/events/${encodeURIComponent(id)}`, input),
  remove: (id: string) => api.delete(`/events/${encodeURIComponent(id)}`),
  createComment: (eventId: string, input: CreateCommentInput) =>
    api.post<Comment>(
      `/events/${encodeURIComponent(eventId)}/comments`,
      input,
    ),
  deleteComment: (id: string) =>
    api.delete(`/comments/${encodeURIComponent(id)}`),
};

export const placesApi = {
  create: (input: CreatePlaceInput) => api.post<Place>("/places", input),
};

export const photosApi = {
  upload: (eventId: string, file: File) => {
    const body = new FormData();
    body.append("photo", file);
    return api.post<Photo>(
      `/events/${encodeURIComponent(eventId)}/photos`,
      body,
    );
  },
  remove: (id: string) => api.delete(`/photos/${encodeURIComponent(id)}`),
};

export const statsApi = {
  ranking: () => api.get<UserStats[]>("/stats/ranking"),
  user: (username: string) =>
    api.get<UserStats>(`/stats/users/${encodeURIComponent(username)}`),
};
