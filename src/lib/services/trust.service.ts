import prisma from "@/lib/prisma";

type TrustAction = "REPORT_SUBMITTED" | "REPORT_VERIFIED" | "REPORT_FLAGGED_FALSE" | "HELPFUL_COMMENT" | "ISSUE_RESOLVED" | "PENALTY_SPAM";

const TRUST_WEIGHTS: Record<TrustAction, number> = {
  REPORT_SUBMITTED: 5,
  REPORT_VERIFIED: 10,
  REPORT_FLAGGED_FALSE: -15,
  HELPFUL_COMMENT: 1,
  ISSUE_RESOLVED: 20,
  PENALTY_SPAM: -30
};

export class TrustScoreService {
  static async updateScore(userId: string, action: TrustAction) {
    try {
      const weight = TRUST_WEIGHTS[action];
      if (!weight) return;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { trustScore: true }
      });

      if (!user) return;

      const newScore = user.trustScore + weight;
      
      const updateData: { trustScore: number; verificationStatus?: string } = { trustScore: newScore };

      // Optional safe flag: if score dips below negative 50, put under review blindly
      if (newScore < -50) {
          updateData.verificationStatus = "UNDER_REVIEW";
      }

      await prisma.user.update({
        where: { id: userId },
        data: updateData
      });

      return { success: true, newScore };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error("[TRUST_ENGINE_UPDATE_ERROR]:", message);
    }
  }

  static getVoteWeight(voterTrustScore: number): number {
    // Voting weight derived from trust score: Minimum 1x multiplier, scales incrementally.
    const multiplier = 1 + (Math.max(voterTrustScore, 0) / 10);
    // Capped at max 10x multiplier 
    return Math.min(Number(multiplier.toFixed(2)), 10);
  }
}
