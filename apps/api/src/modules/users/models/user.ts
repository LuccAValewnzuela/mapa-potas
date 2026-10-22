export type User = {
  id: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  status: "pending" | "active" | "rejected";
  role: "member" | "admin";
  createdAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
};
