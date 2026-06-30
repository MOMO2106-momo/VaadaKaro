import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Fetch all badges in the system, merged with the current user's earned badges.
 * Returns an array shaped as Achievement[] (with earned: boolean).
 */
export async function getUserBadges() {
  "use server";
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, badges: [] };

    const userId = session.user.id;

    // All available badges, ordered by points required
    const allBadges = await (prisma as any).badge.findMany({
      orderBy: { pointsRequired: "asc" },
    });

    // Badges this user has already earned
    const userBadges = await (prisma as any).userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });

    const earnedBadgeIds = new Set(userBadges.map((ub: any) => ub.badgeId));

    const badges = allBadges.map((b: any) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      icon: b.icon ?? "🏅",
      earned: earnedBadgeIds.has(b.id),
      pointsRequired: b.pointsRequired,
    }));

    return { success: true, badges };
  } catch (error) {
    console.error("[GET_USER_BADGES_ERROR]:", error);
    return { success: false, badges: [] };
  }
}

/**
 * Fetch top users for the leaderboard.
 */
export async function getLeaderboardData() {
  try {
    const users = await (prisma as any).user.findMany({
      orderBy: { trustScore: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        image: true,
        points: true,
        trustScore: true,
        citizenId: true,
        verificationStatus: true,
        _count: {
          select: {
            complaints: true,
            votes: true,
            badges: true,
          }
        }
      }
    });

    return { success: true, users };
  } catch (error) {
    console.error("[LEADERBOARD_ACTION_ERROR]:", error);
    return { success: false, error: "Failed to fetch leaderboard." };
  }
}

/**
 * Get community-wide gamification statistics.
 */
export async function getCommunityStats() {
  try {
    const totalPoints = await (prisma as any).user.aggregate({
      _sum: { points: true }
    });

    const activeCitizens = await (prisma as any).user.count({
      where: { role: 'CITIZEN' }
    });

    const totalVerifications = await (prisma as any).vote.count();

    const topContributors = await (prisma as any).user.findMany({
      orderBy: { points: 'desc' },
      take: 5,
      select: { name: true, points: true }
    });

    return {
      success: true,
      stats: {
        totalPoints: totalPoints._sum.points || 0,
        activeCitizens,
        totalVerifications,
        topContributors
      }
    };
  } catch (error) {
    console.error("[COMMUNITY_STATS_ERROR]:", error);
    return { success: false, error: "Failed to fetch community stats." };
  }
}

/**
 * Get user's specific ranking and badge progress.
 */
export async function getUserGamificationProfile(userId?: string) {
  try {
    const session = await auth();
    const targetUserId = userId || session?.user?.id;
    if (!targetUserId) return null;

    const user = await (prisma as any).user.findUnique({
      where: { id: targetUserId },
      include: {
        userBadges: {
          include: { badge: true }
        },
        _count: {
          select: {
            complaints: true,
            votes: true,
          }
        }
      }
    });

    if (!user) return null;

    // Calculate rank
    const rank = await (prisma as any).user.count({
      where: {
        points: { gt: (user as any).points }
      }
    }) + 1;

    // Get all possible badges to find "Next Badge"
    const allBadges = await (prisma as any).badge.findMany({
      orderBy: { pointsRequired: 'asc' }
    });

    const nextBadge = allBadges.find((b: any) => b.pointsRequired > (user as any).points);

    return {
      ...user,
      rank,
      nextBadge
    };
  } catch (error) {
    console.error("[USER_GAMIFICATION_PROFILE_ERROR]:", error);
    return null;
  }
}
