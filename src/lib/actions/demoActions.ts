import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setupDemoData() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // 1. Create Sample Users (Simulated Partners)
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
        isVerified: true
      },
    });

    // Create Accountability Partner relation
    await (prisma as any).accountabilityPartner.upsert({
      where: { 
        senderId_receiverId: { senderId: user.id, receiverId: userId } 
      },
      update: { status: "ACCEPTED" },
      create: { 
        senderId: user.id, 
        receiverId: userId, 
        status: "ACCEPTED" 
      }
    });
  }

  // 2. Create Sample Promises for Partners
  const samplePromises = [
    { title: "Walk 10k steps daily", category: "Health", userId: "simulated" },
    { title: "Plant 50 trees this month", category: "Environment", userId: "simulated" },
    { title: "Support local businesses", category: "Social", userId: "simulated" },
  ];

  // 3. Seed Platform Metrics for Judge Dashboard
  const metrics = [
    { key: "total_promises_platform", value: 1250 },
    { key: "success_rate_platform", value: 78.5 },
    { key: "active_communities", value: 42 },
    { key: "total_proofs_verified", value: 3840 },
  ];

  for (const m of metrics) {
    await (prisma as any).platformMetric.upsert({
      where: { key: m.key },
      update: { value: m.value },
      create: m
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/judge-dashboard");
  
  return { success: true };
}

export async function getPlatformMetrics() {
  const metrics = await (prisma as any).platformMetric.findMany();
  return (metrics || []).reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
}
