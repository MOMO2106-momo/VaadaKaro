import prisma from "@/lib/prisma";

export const POINTS_CONFIG = {
  REPORT_COMPLAINT: 10,
  COMPLAINT_VERIFIED: 20,
  UPVOTE_ACTION: 1,
  VERIFICATION_ACTION: 1,
  COMMENT: 2,
};

export class GamificationService {
  /**
   * Award points to a user and check for new badges.
   */
  static async awardPoints(userId: string, points: number) {
    if (points === 0) return;

    try {
      const user = await (prisma as any).user.update({
        where: { id: userId },
        data: {
          points: {
            increment: points,
          },
        },
        select: {
          id: true,
          points: true,
        },
      });

      await this.checkAndAwardBadges(user.id, user.points);
      return user;
    } catch (error) {
      console.error("[GAMIFICATION_SERVICE_ERROR]:", error);
      throw error;
    }
  }

  /**
   * Check if user qualifies for new badges based on their total points.
   * Queries the Badge table dynamically — badge criteria live in the database,
   * seeded via prisma/seed.ts. No hardcoded config needed here.
   */
  static async checkAndAwardBadges(userId: string, totalPoints: number) {
    // Get badges user already has
    const userBadgeIds = (await (prisma as any).userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    })).map((ub: any) => ub.badgeId);

    // Get all badges user qualifies for
    const eligibleBadges = await (prisma as any).badge.findMany({
      where: {
        pointsRequired: {
          lte: totalPoints,
        },
        id: {
          notIn: userBadgeIds,
        },
      },
    });

    if (eligibleBadges.length > 0) {
      await (prisma as any).userBadge.createMany({
        data: eligibleBadges.map((badge: any) => ({
          userId,
          badgeId: badge.id,
        })),
      });

      // Create notification for each new badge
      for (const badge of (eligibleBadges as any[])) {
        await (prisma as any).notification.create({
          data: {
            userId,
            title: "New Badge Awarded!",
            message: `Congratulations! You've earned the "${badge.name}" badge.`,
            type: "BADGE_AWARDED",
          },
        });
      }
    }
  }
}

