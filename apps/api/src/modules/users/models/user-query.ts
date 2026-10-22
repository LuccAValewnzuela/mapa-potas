export type UserQuery = {
  id?: string;
  username?: string;
  status?: "pending" | "active" | "rejected";
  role?: "member" | "admin";
};
