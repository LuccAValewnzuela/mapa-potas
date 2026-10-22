export type AuthUserDto = {
  id: string;
  username: string;
  displayName: string;
  status: "pending" | "active" | "rejected";
  role: "member" | "admin";
  createdAt: Date;
};
