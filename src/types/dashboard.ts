// ─── Dashboard Type System ────────────────────────────────────────────────────

export interface CitizenProfile {
    name: string;
    email: string;
    citizenId: string;
    role: string;
    location: string;
    joinedAt: string;
    avatarInitials: string;
    trustScore: number;
    verificationStatus: "VERIFIED" | "PENDING" | "UNVERIFIED";
    points: number;
    rank: number;
    streakDays: number;
}

export interface Submission {
    id: string;
    title: string;
    department: string;
    category: string;
    status: "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
    priority: "HIGH" | "MEDIUM" | "LOW";
    submittedAt: string;
    trackingId: string;
    lastUpdated: string;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    pointsRequired: number;
}

export interface StatCardData {
    label: string;
    value: string | number;
    change: string;
    positive: boolean;
    icon: React.ReactNode;
    color: string;
}
