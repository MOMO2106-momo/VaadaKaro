"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createPromise(data: {
  title: string;
  description: string;
  category: string;
  targetDate: string;
  visibility?: string;
  latitude?: number;
  longitude?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const promise = await prisma.promise.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        targetDate: new Date(data.targetDate),
        visibility: data.visibility || "PUBLIC",
        latitude: data.latitude,
        longitude: data.longitude,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/promises");
    return { success: true, id: promise.id };
  } catch (error) {
    console.error("Create error:", error);
    return { success: false, error: "Failed to create promise" };
  }
}

export async function getUserPromises() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.promise.findMany({
    where: { userId: session.user.id },
    include: {
      progressEntries: { orderBy: { createdAt: "desc" }, take: 5 },
      _count: { select: { promiseComments: true, reactions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPromiseById(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.promise.findFirst({
    where: { id, userId: session.user.id },
    include: {
      progressEntries: { orderBy: { createdAt: "desc" } },
      promiseComments: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      proofs: { orderBy: { createdAt: "desc" } },
      user: { select: { name: true, email: true } },
    },
  });
}

export async function updatePromise(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    category: string;
    targetDate: string;
    status: string;
    visibility: string;
  }>
) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await prisma.promise.updateMany({
      where: { id, userId: session.user.id },
      data: {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
      },
    });
    revalidatePath(`/dashboard/promises/${id}`);
    revalidatePath("/dashboard/promises");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update promise" };
  }
}

export async function deletePromise(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await prisma.promise.deleteMany({ where: { id, userId: session.user.id } });
    revalidatePath("/dashboard/promises");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete promise" };
  }
}

export async function addProgress(promiseId: string, percentage: number, note: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const owned = await prisma.promise.findFirst({
    where: { id: promiseId, userId: session.user.id },
  });
  if (!owned) return { success: false, error: "Promise not found" };

  try {
    await prisma.$transaction([
      prisma.progressEntry.create({
        data: { promiseId, percentage, note },
      }),
      prisma.promise.update({
        where: { id: promiseId },
        data: {
          completionRate: percentage,
          status: percentage >= 100 ? "COMPLETED" : "ACTIVE",
          completedDate: percentage >= 100 ? new Date() : null,
        },
      }),
    ]);

    revalidatePath(`/dashboard/promises/${promiseId}`);
    return { success: true };
  } catch (error) {
    console.error("Progress error:", error);
    return { success: false, error: "Failed to update progress" };
  }
}

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const promises = await prisma.promise.findMany({
      where: { userId: session.user.id },
    });

    const total = promises.length;
    const active = promises.filter((p) => p.status === "ACTIVE").length;
    const completed = promises.filter((p) => p.status === "COMPLETED").length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, active, completed, successRate };
  } catch (error) {
    return { total: 0, active: 0, completed: 0, successRate: 0 };
  }
}

export async function getMapPromises() {
  try {
    return prisma.promise.findMany({
      where: {
        visibility: "PUBLIC",
        latitude: { not: null },
        longitude: { not: null },
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
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
