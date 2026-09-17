'use server';

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Seeds a few sample "accountability partner" connections for the current
 * user so /judge-dashboard and the Promises feature have something to show
 * during a demo. Safe to call repeatedly (idempotent).
 *
 * NOTE: this previously used `prisma.accountabilityPartner.upsert({ where:
 * { senderId_receiverId: ... } })`, but AccountabilityPartner has no such
 * unique constraint and its real columns are requesterId/receiverId, not
 * senderId/receiverId — every call threw. Rewritten to use the real schema
 * and a findFirst + create/update instead of a unique-key upsert.
 */
export async function setupDemoData() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const partners = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Sarah Smith", email: "sarah@example.com" },
    { name: "Community Hero", email: "hero@example.com" },
  ];

  for (const p of partners) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: {
        name: p.name,
        email: p.email,
        role: "CITIZEN",
        isVerified: true,
      },
    });

    const existing = await prisma.accountabilityPartner.findFirst({
      where: { requesterId: user.id, receiverId: userId },
    });

    if (existing) {
      await prisma.accountabilityPartner.update({
        where: { id: existing.id },
        data: { status: "ACCEPTED" },
      });
    } else {
      await prisma.accountabilityPartner.create({
        data: { requesterId: user.id, receiverId: userId, status: "ACCEPTED" },
      });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/judge-dashboard");

  return { success: true };
}

/**
 * Real platform-wide counts for /judge-dashboard.
 *
 * Previously this read from a `platformMetric` table that does not exist
 * anywhere in prisma/schema.prisma — every call threw, crashing the page.
 * Rather than add a new model + migration just to store hand-picked demo
 * numbers, this now computes honest live aggregates from data that already
 * exists, so the dashboard reflects the real database.
 */
export async function getPlatformMetrics() {
  const [totalPromises, completedPromises, activeCommunities, totalProofs] =
    await Promise.all([
      prisma.promise.count(),
      prisma.promise.count({ where: { status: "COMPLETED" } }),
      prisma.user
        .findMany({
          where: { addressCity: { not: null } },
          select: { addressCity: true },
          distinct: ["addressCity"],
        })
        .then((rows) => rows.length),
      prisma.proof.count(),
    ]);

  const successRate =
    totalPromises > 0
      ? Math.round((completedPromises / totalPromises) * 1000) / 10
      : 0;

  return {
    total_promises_platform: totalPromises,
    success_rate_platform: successRate,
    active_communities: activeCommunities,
    total_proofs_verified: totalProofs,
  };
}
