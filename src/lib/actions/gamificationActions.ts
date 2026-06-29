"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getLevelFromPoints } from "@/lib/gamification";

export async function awardGamificationPoints(action: "LOGIN" | "REPORT" | "VOTE" | "PROMISE" | "AI_USAGE") {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Unauthorized" };

    const pointsMap = {
        LOGIN: 10,
        REPORT: 50,
        VOTE: 5,
        PROMISE: 100,
        AI_USAGE: 5
    };

    const pointsToAward = pointsMap[action] || 0;

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { points: true, trustScore: true }
        });

        if (!user) return { success: false, message: "User not found" };

        const oldLevel = getLevelFromPoints(user.points).name;

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                points: { increment: pointsToAward },
                trustScore: { increment: pointsToAward } // Trust score scales identically for now
            }
        });

        const newLevel = getLevelFromPoints(updated.points).name;

        return {
            success: true,
            pointsAwarded: pointsToAward,
            newTotal: updated.points,
            levelUp: oldLevel !== newLevel ? newLevel : false
        };
    } catch (error) {
        console.error("Gamification Error:", error);
        return { success: false, error: "Failed to award points" };
    }
}
