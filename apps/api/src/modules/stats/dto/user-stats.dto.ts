export type UserStatsDto = {
  id: string;
  username: string;
  displayName: string;
  total: number;
  month: number;
  lastEventAt: Date | null;
};
