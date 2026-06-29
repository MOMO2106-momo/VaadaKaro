"use server";

import prisma from "@/lib/prisma";

// ─── Utils ────────────────────────────────────────────────────────────────────

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isWithin30Days(date: Date) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return date >= cutoff;
}

function scorePriority(priority: string): number {
  if (priority === "URGENT")  return 4;
  if (priority === "HIGH")    return 3;
  if (priority === "MEDIUM")  return 2;
  return 1;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClusterAnalysis {
  clusterId: string | null;
  clusterStatus: "active" | "hotspot" | "escalated" | "resolved";
  severityLevel: "low" | "medium" | "high" | "critical";
  issueCount: number;
  escalationFlag: boolean;
  escalationReason: string | null;
}

// ─── Core Engine ──────────────────────────────────────────────────────────────

/**
 * Process a single complaint through the Cluster + Escalation Engine.
 * Groups issues, detects hotspots, and evaluates real-world escalation urgency.
 * NO AI involved — pure rule-based civic logic.
 */
export async function processComplaintClustering(complaintId: string): Promise<ClusterAnalysis> {
  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });

  if (!complaint || !complaint.latitude || !complaint.longitude) {
    return {
      clusterId: null,
      clusterStatus: "active",
      severityLevel: "low",
      issueCount: 1,
      escalationFlag: false,
      escalationReason: null
    };
  }

  // Fetch active clusters of same category
  // @ts-ignore - dynamic Prisma model
  const activeClusters = await prisma.cluster.findMany({
    where: { type: complaint.category || "unknown", status: { not: "resolved" } }
  });

  let assignedCluster: any = null;

  // ── GROUPING RULE: 500m radius + same category ───────────────────────────
  for (const cluster of activeClusters) {
    if (!cluster.latitude || !cluster.longitude) continue;
    const dist = getDistance(complaint.latitude!, complaint.longitude!, cluster.latitude, cluster.longitude);
    if (dist <= 500) {
      assignedCluster = cluster;
      break;
    }
  }

  const priorityScore = scorePriority(complaint.priority || "MEDIUM");

  if (assignedCluster) {
    const newIssueCount = assignedCluster.issueCount + 1;
    const newSeverityScore = assignedCluster.severityScore + priorityScore;

    // ── HOTSPOT DETECTION ─────────────────────────────────────────────────
    let newStatus = assignedCluster.status;
    if (newIssueCount >= 3 || newSeverityScore > 6) {
      newStatus = "hotspot";
    }

    // ── ESCALATION RULE ───────────────────────────────────────────────────
    let escalationFlag = false;
    let escalationReason: string | null = null;

    if (newIssueCount >= 3) {
      escalationFlag = true;
      escalationReason = `${newIssueCount} unresolved issues grouped in the same zone.`;
      newStatus = "escalated";
    } else if (complaint.priority === "URGENT") {
      escalationFlag = true;
      escalationReason = "Critical severity issue detected in cluster.";
      newStatus = "escalated";
    }

    // @ts-ignore
    await prisma.cluster.update({
      where: { id: assignedCluster.id },
      data: { issueCount: newIssueCount, severityScore: newSeverityScore, status: newStatus }
    });

    await prisma.complaint.update({
      where: { id: complaintId },
      data: { clusterId: assignedCluster.id } as any
    });

    // Map severity score to label
    const severityLevel: ClusterAnalysis["severityLevel"] =
      newSeverityScore > 10 ? "critical" : newSeverityScore > 6 ? "high" : newSeverityScore > 3 ? "medium" : "low";

    return { clusterId: assignedCluster.id, clusterStatus: newStatus as any, severityLevel, issueCount: newIssueCount, escalationFlag, escalationReason };

  } else {
    // Create new cluster
    // @ts-ignore
    const newCluster = await prisma.cluster.create({
      data: {
        type: complaint.category || "unknown",
        severityScore: priorityScore,
        issueCount: 1,
        latitude: complaint.latitude,
        longitude: complaint.longitude,
        radius: 500,
        status: "active"
      }
    });

    await prisma.complaint.update({
      where: { id: complaintId },
      data: { clusterId: newCluster.id } as any
    });

    return { clusterId: newCluster.id, clusterStatus: "active", severityLevel: "low", issueCount: 1, escalationFlag: false, escalationReason: null };
  }
}


/**
 * Scan all active Promises and auto-escalate delayed ones.
 * Returns how many promises were escalated.
 */
export async function runPromiseEscalationScan() {
  const now = new Date();

  const overduePromises = await prisma.promise.findMany({
    where: {
      status: { notIn: ["completed", "delayed"] },
      targetDate: { lt: now }
    }
  });

  for (const p of overduePromises) {
    await prisma.promise.update({
      where: { id: p.id },
      data: { status: "delayed" }
    });
  }

  return { escalatedPromises: overduePromises.length };
}


/**
 * Full community scan: returns all active hotspots + escalated clusters.
 * Used as input for VaadaAI intelligence context.
 */
export async function getCommunityHotspots() {
  // @ts-ignore
  const hotspots = await prisma.cluster.findMany({
    where: { status: { in: ["hotspot", "escalated"] } },
    orderBy: { severityScore: "desc" },
    take: 10
  });

  return hotspots.map((h: any) => ({
    clusterId: h.id,
    type: h.type,
    issueCount: h.issueCount,
    severityScore: h.severityScore,
    status: h.status,
    lat: h.latitude,
    lng: h.longitude
  }));
}
