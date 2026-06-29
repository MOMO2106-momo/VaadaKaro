"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function seedDemoPromises() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const userId = session.user.id;

  try {
    // Clear existing for clean demo
    await prisma.progressEntry.deleteMany({ where: { promise: { userId } } });
    await prisma.proof.deleteMany({ where: { promise: { userId } } });
    await prisma.promise.deleteMany({ where: { userId } });

    const demoPromises = [
      {
        title: "Submit Final Year Thesis",
        description: "Complete all documentation and get advisor approval.",
        category: "Education",
        targetDate: new Date("2026-07-15"),
        completionRate: 65,
        visibility: "PUBLIC",
      },
      {
        title: "Run a Half Marathon",
        description: "Participate in the local city run and finish under 2 hours.",
        category: "Health",
        targetDate: new Date("2026-11-20"),
        completionRate: 30,
        visibility: "PUBLIC",
      },
      {
        title: "Launch Accountability SaaS",
        description: "Build a platform for tracking personal promises with AI verification.",
        category: "Career",
        targetDate: new Date("2026-08-01"),
        completionRate: 10,
        visibility: "PRIVATE",
      }
    ];

    for (const p of demoPromises) {
      await (prisma as any).promise.create({
        data: { ...p, userId }
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Seeding failed" };
  }
}
