import prisma from "@/lib/prisma";
import crypto from "crypto";
import { auth } from "@/auth";

export async function submitVerification(data: { phone?: string, email?: string, rawIdDocument?: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    
    const userId = session.user.id;

    // Simulate OTP/Email Checking Rules here...
    // Proceeding straight to simulated verified payload

    // Generate specific identity structure VK-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomize = Math.floor(10000 + Math.random() * 90000);
    const citizenId = `VK-${year}-${randomize}`;

    let idFingerprint = null;
    if (data.rawIdDocument) {
      // Create hashed fingerprint. Never store the actual content in the schema.
      idFingerprint = crypto.createHash('sha256').update(data.rawIdDocument).digest('hex');
    }

    const verificationPayload = {
      verificationStatus: idFingerprint ? "VERIFIED" : "PENDING",    
      citizenId,
      idFingerprint
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: verificationPayload
    });

    return { success: true, citizenId: updatedUser.citizenId, status: updatedUser.verificationStatus };
  } catch (err: any) {
    console.error("[VERIFICATION_ENGINE_ERROR]:", err.message);
    return { success: false, error: "Identity verification failed." };
  }
}
