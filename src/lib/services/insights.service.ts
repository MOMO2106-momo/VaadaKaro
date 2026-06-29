import prisma from "@/lib/prisma";

export interface Hotspot {
  id: string;
  latitude: number;
  longitude: number;
  category: string;
  count: number;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
}

export interface CommunityInsight {
  title: string;
  value: string | number;
  description: string;
  trend: 'up' | 'down' | 'stable';
  type: 'RESOLUTION' | 'VOLUME' | 'ENGAGEMENT';
}

export class CommunityInsightsService {
  /** Prisma client type casting retained for build stability when @prisma/client types may be stale. */
  /**
   * Identifies hotspots by clustering complaints within a specific radius (approx 500m).
   */
  static async detectHotspots(): Promise<Hotspot[]> {
    const complaints = await (prisma as any).complaint.findMany({
      where: {
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS'] },
        latitude: { not: null },
        longitude: { not: null }
      },
      select: { id: true, latitude: true, longitude: true, category: true, priority: true }
    }) as Array<{ id: string; latitude: number | null; longitude: number | null; category: string; priority: string | null }>;

    const hotspots: Hotspot[] = [];
    const visited = new Set<string>();
    const RADIUS = 0.005; // Approx 500m in lat/lng

    for (const c of complaints) {
      if (visited.has(c.id) || c.latitude == null || c.longitude == null) continue;

      const lat = c.latitude;
      const lng = c.longitude;

      const cluster = complaints.filter(
        (other) =>
          !visited.has(other.id) &&
          other.latitude != null &&
          other.longitude != null &&
          Math.abs(other.latitude - lat) < RADIUS &&
          Math.abs(other.longitude - lng) < RADIUS &&
          other.category === c.category
      );

      if (cluster.length >= 3) {
        cluster.forEach((item) => visited.add(item.id));

        hotspots.push({
          id: `hotspot-${c.id}`,
          latitude: lat,
          longitude: lng,
          category: c.category,
          count: cluster.length,
          priority: cluster.some(
            (item) => item.priority === "URGENT" || item.priority === "HIGH"
          )
            ? "URGENT"
            : "HIGH",
        });
      }
    }

    return hotspots;
  }

  /**
   * Calculates a community health score (0-100).
   */
  static async calculateHealthScore(): Promise<{ score: number; factors: { resolutionRate: number; engagement: number } }> {
    const [total, resolved, votes] = await Promise.all([
      (prisma as any).complaint.count(),
      (prisma as any).complaint.count({ where: { status: 'RESOLVED' } }),
      (prisma as any).vote.count()
    ]);

    if (total === 0) return {
      score: 100,
      factors: { resolutionRate: 100, engagement: 0 }
    };
    const resolutionRate = (resolved / total) * 100;
    const engagementFactor = Math.min(40, (votes / total) * 10); // Max 40 points for engagement
    
    const score = Math.round((resolutionRate * 0.6) + engagementFactor);
    
    return {
      score: Math.min(100, score),
      factors: {
        resolutionRate: Math.round(resolutionRate),
        engagement: votes
      }
    };
  }

  /**
   * Generates insight cards for the dashboard.
   */
  static async generateInsights(): Promise<CommunityInsight[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalActive, recentlyResolved, topCategory] = await Promise.all([
      (prisma as any).complaint.count({ where: { status: { not: 'RESOLVED' } } }),
      (prisma as any).complaint.count({ where: { status: 'RESOLVED', updatedAt: { gte: thirtyDaysAgo } } }),
      (prisma as any).complaint.groupBy({
        by: ['category'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1
      })
   ]);

    const insights: CommunityInsight[] = [
      {
        title: "Active Grievances",
        value: totalActive,
        description: "Unresolved issues requiring attention.",
        trend: 'stable',
        type: 'VOLUME'
      },
      {
        title: "Resolution Velocity",
        value: `${recentlyResolved}`,
        description: "Issues resolved in the last 30 days.",
        trend: 'up',
        type: 'RESOLUTION'
      },
      {
        title: "Primary Concern",
        value: topCategory?.[0]?.category ?? "None",
        description: "Most reported category across all wards.",
        trend: 'stable',
        type: 'VOLUME'
      }
    ];

    return insights;
  }
}
