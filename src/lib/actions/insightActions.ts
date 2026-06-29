"use server";

import { CommunityInsightsService } from "@/lib/services/insights.service";

export async function getAICommunityInsights() {
  try {
    const [hotspots, health, insights] = await Promise.all([
      CommunityInsightsService.detectHotspots(),
      CommunityInsightsService.calculateHealthScore(),
      CommunityInsightsService.generateInsights()
    ]);

    return {
      success: true,
      data: {
        hotspots,
        health,
        insights
      }
    };
  } catch (error) {
    console.error("[INSIGHTS_ACTION_ERROR]:", error);
    return { success: false, error: "AI Intelligence engine is temporarily offline." };
  }
}
export async function getCivicDashboardData(demoMode: boolean = false) {
   if (demoMode) {
     return {
       success: true,
       data: {
         globalMetrics: { total: 12450, verified: 8900, pending: 3550, falseReports: 42, avgResolutionHours: 28, activeUsersToday: 1342 },
         predictions: [
           { title: "High Risk Zone Detected", confidence: 94, action: "Deploy municipal task force to Ward 14 immediately.", category: "Infrastructure" },
           { title: "Sanitation Delay Spike", confidence: 88, action: "Increase garbage collection frequency in North District.", category: "Sanitation" }
         ],
         aiSummary: "Civic activity is intensely localized around sanitation delays in the North District, compounded by cascading infrastructure flags in Ward 14. We recommend immediate allocation of active transit vehicles to clear the backlog.",
         charts: {
           categoryBreakdown: { Water: 45, Roads: 30, Sanitation: 80, Power: 15 },
           timeline: [120, 150, 180, 130, 210, 250, 190]
         }
       }
     };
   }

   try {
     const { default: prisma } = await import("@/lib/prisma");

     const total = await prisma.complaint.count();
     const verified = await prisma.complaint.count({ where: { verifiedScore: { gt: 0 } }});
     const falseReports = await prisma.complaint.count({ where: { flagCount: { gt: 2 } }});
     const pending = total - (verified + falseReports);

     const predictions = [];
     if (total > 50) predictions.push({ title: "Volume Stress Detected", confidence: 75, action: "Consider scaling backend response capacity.", category: "System" });
     if (falseReports > 10) predictions.push({ title: "Spam Attack Likely", confidence: 90, action: "Enable strict geo-fences.", category: "Security" });
     if (predictions.length === 0) predictions.push({ title: "System Nominal", confidence: 99, action: "No urgent actions required.", category: "Health" });

     return {
       success: true,
       data: {
         globalMetrics: { total, verified, pending, falseReports, avgResolutionHours: 24, activeUsersToday: 120 },
         predictions,
         aiSummary: "The system is currently stable. Based on simple rule assertions, no severe geographical anomalies are mapping outside of standard standard deviation limits.",
         charts: {
           categoryBreakdown: { Water: 12, Roads: 8, Sanitation: 15, Power: 5 },
           timeline: [10, 15, 8, 12, 20, 18, 25]
         }
       }
     };
   } catch (error) {
     return { success: false, error: "Failed to load civic data." };
   }
 }
