import prisma from "@/lib/prisma";

export async function getCommunityActivity() {
  try {
    // Fetch recent votes, comments, and badge awards as "Activity"
    const [votes, comments, badges] = await Promise.all([
      (prisma as any).vote.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } }, complaint: { select: { title: true } } }
      }),
      (prisma as any).comment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } }, complaint: { select: { title: true } } }
      }),
      (prisma as any).userBadge.findMany({
        take: 5,
        orderBy: { earnedAt: 'desc' },
        include: { user: { select: { name: true } }, badge: { select: { name: true, icon: true } } }
      })
    ]);

    const activity = [
      ...votes.map((v: any) => ({ 
        type: 'VOTE', 
        user: v.user.name, 
        target: v.complaint.title, 
        date: v.createdAt,
        text: `verified an issue` 
      })),
      ...comments.map((c: any) => ({ 
        type: 'COMMENT', 
        user: c.user.name, 
        target: c.complaint.title, 
        date: c.createdAt,
        text: `commented on` 
      })),
      ...badges.map((b: any) => ({ 
        type: 'BADGE', 
        user: b.user.name, 
        target: b.badge.name, 
        date: b.earnedAt,
        text: `earned the badge`,
        icon: b.badge.icon 
      }))
    ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

    return { success: true, activity };
  } catch (error) {
    console.error("[COMMUNITY_ACTIVITY_ERROR]:", error);
    return { success: false, activity: [] };
  }
}
