'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import { createNotification } from './notificationActions';

import { complaintSchema } from '@/lib/validation';
import { logAction } from './auditActions';
import { sendComplaintConfirmationEmail, sendComplaintToGovernment } from './emailActions';
import { AntiSpamService } from '@/lib/services/antiSpam.service';
import { TrustScoreService } from '@/lib/services/trust.service';

export async function submitComplaint(data: any) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id as string;

    // 0. DIAGNOSTIC LOGGING
    console.log("Incoming Complaint Data:", JSON.stringify(data, null, 2));

    // 1. SERVER-SIDE VALIDATION
    const validatedData = complaintSchema.safeParse(data);
    if (!validatedData.success) {
      const flattenedErrors = validatedData.error.flatten();
      console.error("Zod Validation Error:", JSON.stringify(flattenedErrors, null, 2));
      
      const fieldErrors = flattenedErrors.fieldErrors as Record<string, string[] | undefined>;
      const firstErrorField = Object.keys(fieldErrors)[0];
      const errorMessage = fieldErrors[firstErrorField]?.[0] || "Invalid input data";
      
      return { 
        success: false, 
        error: `${errorMessage} (${firstErrorField})`,
        validationErrors: flattenedErrors.fieldErrors
      };
    }

    const { 
      title, 
      description, 
      department, 
      category, 
      priority, 
      address, 
      city, 
      state, 
      pincode, 
      attachments,
      latitude,
      longitude
    } = validatedData.data;

    const location = `${address}, ${city}, ${state}`;

    // 2. DUPLICATE PREVENTION & RATE LIMITING
    const canPost = await AntiSpamService.checkRateLimit(userId);
    if (!canPost) {
       return { success: false, error: "Rate limit exceeded. Trust penalty applied.", isDuplicate: true };
    }

    if (data.latitude && data.longitude) {
      const isGeoDuplicate = await AntiSpamService.checkDuplicateOrSimilar(data.latitude, data.longitude, category);
      if (isGeoDuplicate && !data.confirmDuplicate) {
         return { success: false, error: "Identical issue detected at this exact geographic pin.", isDuplicate: true };
      }
    }

    const trackingId = `VDK-${new Date().getFullYear()}-${crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase()}`;
    
    // 3. DATABASE PERSISTENCE
    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        department,
        category,
        priority,
        location,
        pincode,
        latitude,
        longitude,
        trackingId,
        citizenId: userId,
        attachments: {
          create: attachments?.map(att => ({
            url: att.url,
            filename: att.filename,
            mimeType: att.mimeType,
            fileSize: att.fileSize,
          }))
        }
      },
    });

    // 4. AUDIT LOGGING
    await logAction({
      action: 'COMPLAINT_CREATED',
      entity: 'COMPLAINT',
      entityId: complaint.id,
      metadata: { trackingId }
    });

    // Create initial update
    await prisma.complaintUpdate.create({
      data: {
        complaintId: complaint.id,
        status: 'SUBMITTED',
        remarks: 'Complaint filed successfully via digital portal.',
        updatedBy: 'SYSTEM',
      }
    });

    // 5. EMAIL NOTIFICATIONS (Background)
    // We don't await these to keep the responsiveness fast
    sendComplaintConfirmationEmail(complaint.id).catch(err => console.error("Email Error:", err));
    sendComplaintToGovernment(complaint.id).catch(err => console.error("Govt Email Error:", err));
    
    // Notify Citizen about successful submission
    await createNotification({
      userId: userId,
      complaintId: complaint.id,
      type: 'COMPLAINT_SUBMITTED',
      title: 'Complaint Successfully Submitted',
      message: `Your complaint #${complaint.trackingId.split('-').pop()} has been successfully registered.`,
      actionUrl: `/track-complaint?id=${complaint.trackingId}`
    });

    // Award Trust Score for reporting
    await TrustScoreService.updateScore(userId, "REPORT_SUBMITTED");

    revalidatePath('/file-complaint');
    revalidatePath('/dashboard');
    return { success: true, trackingId: complaint.trackingId, department: complaint.department };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, error: 'Failed to submit complaint' };
  }
}

export async function getUserComplaints() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };
    const userId = session.user.id as string;

    const complaints = await prisma.complaint.findMany({
      where: { citizenId: userId },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, complaints };
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, error: 'Failed to fetch complaints' };
  }
}

export async function getComplaintByTrackingId(trackingId: string) {
  try {
    const session = await auth();
    const userRole = session?.user?.role;
    const userId = session?.user?.id as string;

    const complaint = await prisma.complaint.findUnique({
      where: { trackingId },
      include: {
        updates: {
          orderBy: { createdAt: 'desc' }
        },
        attachments: true // We'll filter this later
      }
    });

    if (!complaint) {
      return { success: false, error: 'Invalid Tracking ID' };
    }

    // Determine access level
    const isOwner = userId === complaint.citizenId;
    const isOfficial = userRole === 'OFFICER' || userRole === 'ADMIN';
    const hasFullAccess = isOwner || isOfficial;

    if (hasFullAccess) {
      return { success: true, complaint };
    }

    // PUBLIC ACCESS: Mask sensitive data
    const publicData = {
      trackingId: complaint.trackingId,
      status: complaint.status,
      title: complaint.title, // Title is generally safe but let's keep it minimal
      category: complaint.category,
      department: complaint.department,
      createdAt: complaint.createdAt,
      updates: complaint.updates.map(u => ({
        status: u.status,
        remarks: u.remarks,
        createdAt: u.createdAt
      })),
      // Hide these:
      description: "REDACTED for privacy",
      location: "REDACTED",
      attachments: [],
      citizenId: "HIDDEN"
    };

    return { 
      success: true, 
      complaint: publicData as any,
      isPublicView: true 
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, error: 'Server error' };
  }
}

export async function verifyComplaint(complaintId: string, isHelpful: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };
    const userId = session.user.id as string;

    const userObj = await prisma.user.findUnique({ where: { id: userId }});
    if (!userObj) return { success: false, error: 'User invalid' };

    const canVote = await AntiSpamService.checkVoteRateLimit(userId);
    if (!canVote) return { success: false, error: 'Voting rate limit exceeded. Please wait a minute.' };

    const weight = TrustScoreService.getVoteWeight(userObj.trustScore);
    const voteValue = isHelpful ? (1 * weight) : (-1 * weight);

    await prisma.vote.upsert({
      where: { userId_complaintId: { userId, complaintId } },
      update: { value: voteValue },
      create: { userId, complaintId, value: voteValue }
    });

    if (isHelpful) {
      await TrustScoreService.updateScore(userId, "REPORT_VERIFIED");
    }

    // Update verifiedScore cache
    await prisma.complaint.update({
      where: { id: complaintId },
      data: { verifiedScore: { increment: voteValue } }
    });

    return { success: true, newWeight: weight };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function flagFalseReport(complaintId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };
    const userId = session.user.id;

    // A flag increments count flagCount
    await prisma.complaint.update({
      where: { id: complaintId },
      data: { flagCount: { increment: 1 } }
    });

    const complaintObj = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (complaintObj) {
        await TrustScoreService.updateScore(complaintObj.citizenId, "REPORT_FLAGGED_FALSE");
    }

    return { success: true };
  } catch(e) {
    return { success: false };
  }
}
