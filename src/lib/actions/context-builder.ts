"use server";

import prisma from "@/lib/prisma";

import { getCommunityHotspots } from "./cluster-engine";

// Basic Haversine distance formula approximation (in meters)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

interface ContextBuilderInput {
  userId: string;
  query: string;
  pageContext: string;
  latitude?: number;
  longitude?: number;
}

/** Cross-task AI memory — shared across CHAT, ANALYSIS, and DOCUMENTS keys */
export async function getSharedAiMemory(userId: string, limit = 8) {
  const history = await prisma.aILegalHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      query: true,
      response: true,
      legalCategory: true,
      createdAt: true,
    },
  });

  return history.reverse().map((entry) => {
    let summary = entry.response.slice(0, 200);
    try {
      const parsed = JSON.parse(entry.response);
      summary =
        parsed.insight ||
        parsed.feedback ||
        parsed.summary ||
        parsed.recommendedAction ||
        summary;
    } catch {
      // keep raw slice
    }
    return {
      task: entry.legalCategory || "UNKNOWN",
      query: entry.query,
      outcome: summary,
      date: entry.createdAt.toISOString().split("T")[0],
    };
  });
}

export async function buildVaadaContext(input: ContextBuilderInput) {
  const { userId, query, pageContext, latitude, longitude } = input;

  // 1. Fetch USER DATA
  const userComplaints = await prisma.complaint.findMany({
    where: { citizenId: userId },
    take: 5,
    orderBy: { createdAt: "desc" }
  });
  const userPromises = await prisma.promise.findMany({
    where: { userId: userId },
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  const userContext = {
    recentComplaints: userComplaints.map(c => ({ id: c.id, title: c.title, status: c.status })),
    activePromises: userPromises.map(p => ({ id: p.id, title: p.title, status: p.status }))
  };

  // 2. Fetch LOCATION DATA (if lat/long exists)
  let locationContext = null;
  if (latitude && longitude) {
    // In production, use PostGIS. For prototyping, fetching recent local and filtering via Haversine.
    const recentGlobalComplaints = await prisma.complaint.findMany({
      where: { status: { not: "RESOLVED" } },
      take: 100,
      orderBy: { createdAt: "desc" }
    });

    const nearbyComplaints = recentGlobalComplaints.filter(c => {
      if (!c.latitude || !c.longitude) return false;
      return getDistance(latitude, longitude, c.latitude, c.longitude) <= 500;
    });

    const recentGlobalPromises = await prisma.promise.findMany({
      take: 100,
      orderBy: { createdAt: "desc" }
    });

    const nearbyPromises = recentGlobalPromises.filter((p: any) => {
      if (!p.latitude || !p.longitude) return false;
      return getDistance(latitude, longitude, p.latitude, p.longitude) <= 500;
    });

    locationContext = {
      nearbyComplaints: nearbyComplaints.map(c => ({ title: c.title, category: c.category })),
      nearbyPromises: nearbyPromises.map(p => ({ title: p.title, status: p.status }))
    };
  }

  // 3. Fetch COMMUNITY DATA (Recurring issues, global trends matching query hints)
  // Determine simple category hints
  const possibleCategories = ["road", "water", "electricity", "sanitation"];
  const matchedCategory = possibleCategories.find(cat => query.toLowerCase().includes(cat)) || "general";

  const recurringIssues = await prisma.complaint.findMany({
    where: { 
      category: { contains: matchedCategory, mode: "insensitive" },
      status: { not: "RESOLVED" }
    },
    take: 5,
    orderBy: { flagCount: "desc" }
  });

  const communityContext = {
    matchedCategory,
    recurringIssues: recurringIssues.map(i => ({ title: i.title, priority: i.priority, flags: i.flagCount }))
  };

  // 4. Fetch CLUSTER CONTEXT
  // @ts-ignore - Prisma dynamic schema lock safety
  const hotspots = await prisma.cluster.findMany({
    where: { status: "escalated" },
    take: 3,
    orderBy: { severityScore: "desc" }
  });

  const clusterContext = {
    hotspotDetectionFlags: hotspots.map((h: any) => ({ type: h.type, issues: h.issueCount, severity: h.severityScore }))
  };

  const sharedAiMemory = await getSharedAiMemory(userId);

  const vaadaContext = {
    userContext,
    locationContext,
    communityContext,
    clusterContext,
    sharedAiMemory,
  };

  return vaadaContext;
}
