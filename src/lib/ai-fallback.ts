/**
 * Rule-based civic responses when Gemini is unavailable.
 * Keeps VaadaAI functional for demos and graceful degradation.
 */

export function buildComplaintAnalysisFallback(
  title: string,
  description: string,
  department: string,
  category: string
) {
  const text = `${title} ${description}`.toLowerCase();
  let score = 45;
  const missing: string[] = [];

  if (description.length > 120) score += 15;
  if (description.length > 250) score += 10;
  if (/\d{4}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(description)) score += 10;
  if (/street|road|ward|sector|block|pincode|pin\s*\d|near|location|area/i.test(description)) score += 10;
  if (filesMentionEvidence(text)) score += 5;

  if (!/street|road|ward|sector|block|near|location|area|pin/i.test(description)) {
    missing.push("Specific location (street, ward, or landmark)");
  }
  if (!/\d|date|day|week|month|yesterday|today|since/i.test(description)) {
    missing.push("When the issue started or was observed");
  }
  if (description.length < 80) {
    missing.push("More descriptive details about impact and frequency");
  }

  score = Math.min(95, Math.max(25, score));
  const level = score >= 75 ? "HIGH" : score >= 50 ? "MEDIUM" : "LOW";

  let suggestedCategory = category;
  if (/pothole|road|crack|highway/i.test(text)) suggestedCategory = "Road & Infrastructure";
  else if (/water|leak|drain|sewage/i.test(text)) suggestedCategory = "Water Supply";
  else if (/garbage|sanitation|waste|dump/i.test(text)) suggestedCategory = "Sanitation";

  return {
    reliabilityScore: score,
    reliabilityLevel: level,
    feedback: `Your ${department} grievance on "${title}" has ${level.toLowerCase()} detail. ${
      missing.length
        ? `Add: ${missing.slice(0, 2).join("; ")}.`
        : "Ready for formal submission with supporting evidence."
    }`,
    suggestedCategory,
    missingDetails: missing,
    fallback: true,
  };
}

function filesMentionEvidence(text: string) {
  return /photo|image|evidence|attached|proof|video/i.test(text);
}

export function buildCivicCopilotFallback(
  query: string,
  pageContext: string
) {
  const q = query.toLowerCase();

  if (/escalat|urgent|priority|serious|repeat/i.test(q)) {
    return {
      success: true,
      fallback: true,
      insight: "Escalation path identified for your civic issue.",
      analysis: "MEDIUM severity — repeated or unresolved grievances qualify for escalation under civic accountability rules.",
      recommendedAction: "File or update your complaint at /file-complaint, then track status at /track-complaint. If unresolved after 15 days, request officer review.",
      escalationFlag: true,
      escalationReason: "Citizen requested escalation guidance for an unresolved civic matter.",
      urgencyLevel: "MEDIUM",
      suggestedAuthorityAction: "Assign reviewing officer and publish status update within 72 hours.",
      actionButtons: [
        { label: "File Complaint", url: "/file-complaint" },
        { label: "Track Progress", url: "/track-complaint" },
        { label: "View Community Map", url: "/community-map" },
      ],
    };
  }

  if (/promise|commit|pledge|accountability/i.test(q)) {
    return {
      success: true,
      fallback: true,
      insight: "Civic promise tracking is available on VaadaKaro.",
      analysis: "LOW severity — accountability commitments help communities track public and personal civic goals.",
      recommendedAction: "Create a public promise at /dashboard/promises/new and share progress with your community.",
      escalationFlag: false,
      escalationReason: null,
      urgencyLevel: "LOW",
      suggestedAuthorityAction: null,
      actionButtons: [
        { label: "Create Promise", url: "/dashboard/promises/new" },
        { label: "View Dashboard", url: "/dashboard" },
      ],
    };
  }

  if (/road|pothole|street|infrastructure|broken/i.test(q)) {
    return {
      success: true,
      fallback: true,
      insight: "Infrastructure grievance detected — roads and public works issues are trackable.",
      analysis: "HIGH severity pattern — road defects often affect multiple citizens and may cluster on the community map.",
      recommendedAction: "File a detailed complaint with location and photos. Check /community-map for nearby similar reports.",
      escalationFlag: true,
      escalationReason: "Infrastructure defects with safety impact should be prioritized.",
      urgencyLevel: "HIGH",
      suggestedAuthorityAction: "Roads department inspection within 48 hours for safety-critical reports.",
      actionButtons: [
        { label: "File Complaint", url: "/file-complaint" },
        { label: "Community Map", url: "/community-map" },
      ],
    };
  }

  if (pageContext === "Map") {
    return {
      success: true,
      fallback: true,
      insight: "Map context active — nearby civic issues and hotspots are prioritized.",
      analysis: "MEDIUM severity — geographic clustering helps identify recurring ward-level problems.",
      recommendedAction: "Tap markers on the community map to investigate issues, then file a linked complaint if yours matches a hotspot.",
      escalationFlag: false,
      escalationReason: null,
      urgencyLevel: "MEDIUM",
      suggestedAuthorityAction: null,
      actionButtons: [
        { label: "Open Map", url: "/community-map" },
        { label: "File Complaint", url: "/file-complaint" },
      ],
    };
  }

  return {
    success: true,
    fallback: true,
    insight: "VaadaAI is providing guided civic assistance.",
    analysis: "LOW severity — general civic guidance. Connect your query to a specific complaint or promise for deeper analysis.",
    recommendedAction: "Describe your issue with location, date, and department. Use File Complaint for formal tracking.",
    escalationFlag: false,
    escalationReason: null,
    urgencyLevel: "LOW",
    suggestedAuthorityAction: null,
    actionButtons: [
      { label: "File Complaint", url: "/file-complaint" },
      { label: "AI Legal Docs", url: "/generate-docs" },
      { label: "Help Center", url: "/support" },
    ],
  };
}

export function extractJsonFromText(raw: string): Record<string, unknown> | null {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
  }
  return null;
}
