import prisma from "@/lib/prisma";
import { TrustScoreService } from "./trust.service";

/**
 * Service to protect the VaadaKaro platform from spam, false reports, and floods.
 */
export class AntiSpamService {
  
  /**
   * Prevents spam by rate limiting complaints created recently by a single citizen.
   * Returns true if user is allowed to post, false if rate limited.
   */
  static async checkRateLimit(userId: string): Promise<boolean> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentSubmissions = await prisma.complaint.count({
      where: {
        citizenId: userId,
        createdAt: { gte: twentyFourHoursAgo }
      }
    });

    // Cap at 5 reports per 24 hours. A user exceeding this is likely spamming.
    if (recentSubmissions >= 5) {
      await TrustScoreService.updateScore(userId, "PENALTY_SPAM");
      return false;
    }

    return true;
  }

  /**
   * Prevents false reports by checking if an exact issue already exists tightly clustered in geography.
   * Geofence radius simulation.
   */
  static async checkDuplicateOrSimilar(latitude: number, longitude: number, category: string): Promise<boolean> {
    // We check for highly suspicious identical complaints in exact proximity (+- 0.0001 roughly 10 meters)
    const threshold = 0.0001; 

    // Because prisma doesn't allow floating math dynamically in where, we use bound limits
    const latMin = latitude - threshold;
    const latMax = latitude + threshold;
    const lngMin = longitude - threshold;
    const lngMax = longitude + threshold;

    const duplicates = await prisma.complaint.count({
      where: {
        category,
        latitude: { gte: latMin, lte: latMax },
        longitude: { gte: lngMin, lte: lngMax },
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS'] } // Active only
      }
    });

    return duplicates > 0;
  }

  /**
   * DB-based rate limit for Voting (Max 5 per minute)
   */
  static async checkVoteRateLimit(userId: string): Promise<boolean> {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentVotes = await prisma.vote.count({
      where: {
        userId,
        createdAt: { gte: oneMinuteAgo }
      }
    });
    return recentVotes < 5;
  }

  /**
   * DB-based rate limit for Commenting (Max 5 per minute)
   */
  static async checkCommentRateLimit(userId: string): Promise<boolean> {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentComments = await prisma.comment.count({
      where: {
        userId,
        createdAt: { gte: oneMinuteAgo }
      }
    });
    return recentComments < 5;
  }
}
