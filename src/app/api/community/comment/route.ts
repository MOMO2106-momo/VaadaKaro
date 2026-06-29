import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { GamificationService, POINTS_CONFIG } from "@/lib/services/gamification.service";
import * as z from "zod";

const commentSchema = z.object({
  complaintId: z.string().cuid(),
  content: z.string().min(1).max(1000),
});

const updateCommentSchema = z.object({
  id: z.string().cuid(),
  content: z.string().min(1).max(1000),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { complaintId, content } = commentSchema.parse(body);
    const userId = session.user.id;

    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          userId,
          complaintId,
        },
      });

      // Award points for commenting
      await GamificationService.awardPoints(userId, POINTS_CONFIG.COMMENT);

      return newComment;
    });

    return NextResponse.json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    console.error("[COMMENT_POST_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const complaintId = searchParams.get("complaintId");

    if (!complaintId) return new NextResponse("Complaint ID required", { status: 400 });

    const comments = await prisma.comment.findMany({
      where: { complaintId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[COMMENT_GET_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { id, content } = updateCommentSchema.parse(body);

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) return new NextResponse("Comment not found", { status: 404 });
    if (comment.userId !== session.user.id) return new NextResponse("Forbidden", { status: 403 });

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    if (error instanceof z.ZodError) return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new NextResponse("Comment ID required", { status: 400 });

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) return new NextResponse("Comment not found", { status: 404 });
    if (comment.userId !== session.user.id) return new NextResponse("Forbidden", { status: 403 });

    await prisma.comment.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
