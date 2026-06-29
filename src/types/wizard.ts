// ─── Wizard Type System ───────────────────────────────────────────────────────

export interface WizardFormData {
    title: string;
    description: string;
    department: string;
    category: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    state: string;
    city: string;
    pincode: string;
    address: string;
    fullName: string;
    phone: string;
    declaration: boolean;
    aiDisclaimer: boolean;
    latitude?: number | null;
    longitude?: number | null;
}

export interface UploadedFile {
    name: string;
    size: number;
    type: string;
}

export interface AiResult {
    feedback: string;
    reliabilityLevel: "HIGH" | "MEDIUM" | "LOW";
    reliabilityScore: number;
    missingDetails: string[];
}

export const DEPARTMENTS = [
    "Police",
    "Municipal Corporation",
    "Electricity",
    "Water Supply",
    "Road & Infrastructure",
    "Cyber Crime",
    "Consumer Court",
    "Women Safety",
    "Other",
] as const;

export type DepartmentType = (typeof DEPARTMENTS)[number];

export const CATEGORIES: Record<string, string[]> = {
    Police: ["Theft", "Assault", "Missing Person", "Public Nuisance", "Traffic Violation"],
    "Municipal Corporation": ["Waste Management", "Illegal Construction", "Stray Animals", "Park Maintenance"],
    Electricity: ["Power Cut", "Faulty Meter", "Voltage Fluctuating", "New Connection Issue"],
    "Water Supply": ["No Water", "Leaking Pipe", "Contaminated Water", "Billing Issue"],
    "Cyber Crime": ["Online Fraud", "Social Media Harassment", "Identity Theft", "Phishing"],
    Other: ["General Inquiry", "Miscellaneous"],
};

export const STATES = [
    "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Haryana",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
    "Uttar Pradesh", "West Bengal",
];

export const STEP_LABELS = ["Categorization", "Location", "Evidence", "Review & Submit"] as const;

export const TOTAL_STEPS = 4;

export const EMPTY_FORM_DATA: WizardFormData = {
    title: "",
    description: "",
    department: "",
    category: "",
    priority: "MEDIUM",
    state: "",
    city: "",
    pincode: "",
    address: "",
    fullName: "",
    phone: "",
    declaration: false,
    aiDisclaimer: false,
    latitude: null,
    longitude: null,
};
