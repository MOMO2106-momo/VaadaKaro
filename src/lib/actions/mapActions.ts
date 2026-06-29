"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUserMapComplaints() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, complaints: [] };

    const complaints = await prisma.complaint.findMany({
      where: { citizenId: session.user.id as string },
      select: {
        id: true,
        trackingId: true,
        title: true,
        category: true,
        status: true,
        priority: true,
        createdAt: true,
        latitude: true,
        longitude: true,
        location: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, complaints };
  } catch (error) {
    console.error("Fetch user map complaints error:", error);
    return { success: false, complaints: [] };
  }
}

export async function getMapComplaints() {
  try {
    const [complaints, promises] = await Promise.all([
      prisma.complaint.findMany({
        where: {
          AND: [{ latitude: { not: null } }, { longitude: { not: null } }],
        },
        include: {
          _count: { select: { votes: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      prisma.promise.findMany({
        where: {
          visibility: "PUBLIC",
          AND: [{ latitude: { not: null } }, { longitude: { not: null } }],
        },
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          latitude: true,
          longitude: true,
          completionRate: true,
        },
        take: 100,
      }),
    ]);

    const stats = {
      total: await prisma.complaint.count(),
      open: await prisma.complaint.count({
        where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS"] } },
      }),
      resolved: await prisma.complaint.count({
        where: { status: "RESOLVED" },
      }),
      verifications: await prisma.vote.count(),
      promises: promises.length,
    };

    return { success: true, complaints, promises, stats };
  } catch (error) {
    console.error("Fetch map complaints error:", error);
    return { success: false, error: "Failed to fetch map data" };
  }
}
