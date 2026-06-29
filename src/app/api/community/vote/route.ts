import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { GamificationService, POINTS_CONFIG } from "@/lib/services/gamification.service";
import * as z from "zod";

const voteSchema = z.object({
  complaintId: z.string().cuid(),
  value: z.enum(["1", "-1", "0"]), // 0 for remove vote
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { complaintId, value } = voteSchema.parse(body);
    const userId = session.user.id;
    const numericValue = parseInt(value);

    // 1. Transaction to handle vote and points
    const result = await prisma.$transaction(async (tx) => {
      // Check if complaint exists
      const complaint = await tx.complaint.findUnique({
        where: { id: complaintId },
      });

      if (!complaint) {
        throw new Error("Complaint not found");
      }

      // Handle vote removal
      if (numericValue === 0) {
        const deletedVote = await tx.vote.deleteMany({
          where: { userId, complaintId },
        });
        return { success: true, removed: deletedVote.count > 0 };
      }

      // Upsert vote
      const vote = await tx.vote.upsert({
        where: {
          userId_complaintId: { userId, complaintId },
        },
        update: { value: numericValue },
        create: {
          userId,
          complaintId,
          value: numericValue,
        },
      });

      // Award points for verification action
      await GamificationService.awardPoints(userId, POINTS_CONFIG.VERIFICATION_ACTION);

      return vote;
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[VOTE_POST_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const complaintId = searchParams.get("complaintId");

    if (!complaintId) {
      return new NextResponse("Complaint ID is required", { status: 400 });
    }

    const votes = await prisma.vote.findMany({
      where: { complaintId },
    });

    const upvotes = votes.filter((v) => v.value === 1).length;
    const downvotes = votes.filter((v) => v.value === -1).length;
    const verificationScore = upvotes - downvotes;

    return NextResponse.json({
      upvotes,
      downvotes,
      verificationScore,
    });
  } catch (error) {
    console.error("[VOTE_GET_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
