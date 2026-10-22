import { AppError } from "../../lib/errors";
import type { UserStats } from "./models/user-stats";
import { StatsRepository } from "./repository";

export class StatsService {
  static async getRanking(): Promise<UserStats[]> {
    const rows = await StatsRepository.getUserStats();
    return rows.filter((row) => row.total > 0);
  }

  static async getUserStats(username: string): Promise<UserStats> {
    const [user] = await StatsRepository.getUserStats({ username: username.toLowerCase() });
    if (!user) throw new AppError(404, "user_not_found", "User not found");
    return user;
  }
}
