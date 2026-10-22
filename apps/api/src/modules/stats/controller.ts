import type { Context } from "hono";
import type { UserStatsDto } from "./dto/user-stats.dto";
import type { UserStats } from "./models/user-stats";
import { StatsService } from "./service";

export class StatsController {
  static async getRanking(c: Context) {
    const ranking = await StatsService.getRanking();
    return c.json(ranking.map(StatsController.toDto));
  }

  static async getUserStats(c: Context) {
    const stats = await StatsService.getUserStats(c.req.param("username") ?? "");
    return c.json(StatsController.toDto(stats));
  }

  private static toDto(stats: UserStats): UserStatsDto {
    return {
      id: stats.id,
      username: stats.username,
      displayName: stats.displayName,
      total: stats.total,
      month: stats.month,
      lastEventAt: stats.lastEventAt,
    };
  }
}
