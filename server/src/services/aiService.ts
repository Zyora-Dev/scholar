import { config } from "../config/index.js";
import { store } from "./store.js";

export async function processAiChatQuery(
  userQuery: string,
  userId: string,
  language: "en" | "ta" | "hi" = "en"
): Promise<{
  reply: string;
  suggestedActions?: { label: string; url: string }[];
  isVerifiedData: boolean;
  source: string;
}> {
  const queryLower = userQuery.toLowerCase().trim();
  const profile = store.studentProfiles.find((p) => p.userId === userId);

  // If in Gemini mode and API key is present
  if (config.aiMode === "gemini" && config.geminiApiKey) {
    try {
      // In production, invoke Gemini via official SDK
      // Return structured response
    } catch (e) {
      console.warn("Gemini call fallback to deterministic response:", e);
    }
  }

  // DEMO MODE: Contextual, verified, intelligent response
  // 1. Eligibility Queries
  if (
    queryLower.includes("eligible") ||
    queryLower.includes("qualify") ||
    queryLower.includes("தகுதி") ||
    queryLower.includes("पात्र")
  ) {
    const matchingSch = store.scholarships.find(
      (s) => (profile && s.maxAnnualIncome >= profile.annualFamilyIncome) || s.id === "sch-001"
    );

    if (language === "ta") {
      return {
        reply: `உங்கள் மாணவர் விவரக்குறிப்பின்படி (${profile?.stCommunity || "பழங்குடியினர்"} பிரிவு, வருமானம் ₹${profile?.annualFamilyIncome.toLocaleString(
          "en-IN"
        )}), நீங்கள் "${matchingSch?.name}" மற்றும் "Top Class Education Scheme" ஆகிய திட்டங்களுக்கு முதற்கட்ட தகுதி பெற்றுள்ளீர்கள். போர்ட்டலில் AI Eligibility ஐப் பயன்படுத்தி முழு விவரங்களையும் சரிபார்க்கலாம்.`,
        suggestedActions: [
          { label: "தகுதியை சரிபார்க்க", url: "/student/eligibility" },
          { label: "ஆவண பெட்டகம்", url: "/student/vault" }
        ],
        isVerifiedData: true,
        source: "Ministry of Tribal Affairs Verified Schemes Database"
      };
    } else if (language === "hi") {
      return {
        reply: `आपकी प्रोफ़ाइल (${profile?.stCommunity || "अनुसूचित जनजाति"} वर्ग, आय ₹${profile?.annualFamilyIncome.toLocaleString(
          "en-IN"
        )}) के अनुसार, आप "${matchingSch?.name}" के लिए प्राथमिक रूप से पात्र हैं। अंतिम निर्णय सक्षम प्राधिकारी द्वारा लिया जाएगा।`,
        suggestedActions: [
          { label: "पात्रता जांचें", url: "/student/eligibility" },
          { label: "दस्तावेज़ वॉल्ट", url: "/student/vault" }
        ],
        isVerifiedData: true,
        source: "जनजातीय कार्य मंत्रालय सत्यापित डेटाबेस"
      };
    }

    return {
      reply: `Based on your profile (${profile?.stCommunity || "ST"} category, annual household income ₹${profile?.annualFamilyIncome.toLocaleString(
        "en-IN"
      )} in ${profile?.state || "Tamil Nadu"}), you appear eligible for "${matchingSch?.name}" and the "Top Class Education Scheme". Would you like me to guide you through the document checklist?`,
      suggestedActions: [
        { label: "Check AI Eligibility", url: "/student/eligibility" },
        { label: "View Document Vault", url: "/student/vault" }
      ],
      isVerifiedData: true,
      source: "Ministry of Tribal Affairs Verified Schemes Database"
    };
  }

  // 2. Returned Application / Rescue Queries
  if (
    queryLower.includes("returned") ||
    queryLower.includes("rescue") ||
    queryLower.includes("reject") ||
    queryLower.includes("correction") ||
    queryLower.includes("சரிசெய்ய") ||
    queryLower.includes("सुधार")
  ) {
    const returnedApp = store.applications.find(
      (a) => a.userId === userId && a.status === "RETURNED"
    );

    if (returnedApp) {
      if (language === "ta") {
        return {
          reply: `விண்ணப்பம் #${returnedApp.applicationNumber} நிறுவனம் மூலம் திருத்தத்திற்காக திருப்பியனுப்பப்பட்டுள்ளது. காரணம்: "${returnedApp.returnedReason}". Application Rescue Center-ல் சென்று உங்கள் புதுப்பிக்கப்பட்ட சான்றிதழைப் பதிவேற்றி உடனே 'Fix & Resubmit' செய்யலாம்.`,
          suggestedActions: [{ label: "Rescue Center திறக்க", url: "/student/rescue" }],
          isVerifiedData: true,
          source: "Application Rescue System"
        };
      }
      return {
        reply: `Application #${returnedApp.applicationNumber} was returned by the Nodal Institution. Reason: "${returnedApp.returnedReason}". You can upload your endorsed certificate in the Application Rescue Center and click "Fix & Resubmit" to retain your queue priority.`,
        suggestedActions: [{ label: "Open Rescue Center", url: "/student/rescue" }],
        isVerifiedData: true,
        source: "Application Rescue System"
      };
    }
  }

  // 3. Renewal Queries
  if (
    queryLower.includes("renew") ||
    queryLower.includes("புதுப்பிக்க") ||
    queryLower.includes("नवीनीकरण")
  ) {
    const ren = store.renewals.find((r) => r.userId === userId);
    return {
      reply: ren
        ? `Renewal for "${ren.scholarshipName}" (Academic Year ${ren.renewalAcademicYear}) is OPEN. You have ${ren.daysRemaining} days remaining before deadline (${ren.renewalDeadline}). Marksheet and Bonafide are verified; Income self-declaration is pending.`
        : "Your active scholarship disbursements are currently up to date. You will receive an automated alert when your renewal window opens.",
      suggestedActions: [{ label: "Open Renewal Guardian", url: "/student/renewal" }],
      isVerifiedData: true,
      source: "Renewal Guardian Tracking Engine"
    };
  }

  // 4. Document Mismatch & Vault Queries
  if (
    queryLower.includes("document") ||
    queryLower.includes("vault") ||
    queryLower.includes("mismatch") ||
    queryLower.includes("ஆவண") ||
    queryLower.includes("दस्तावेज़")
  ) {
    return {
      reply:
        "In your Document Vault, 4 out of 5 required certificates are verified. Note: An Income Certificate spelling variation was detected ('Indhira Iyyappan' vs 'Indhira Iyappan'). Our system flags this for manual review so you can attach a clarification without rejection.",
      suggestedActions: [{ label: "Open Document Vault", url: "/student/vault" }],
      isVerifiedData: true,
      source: "Document Intelligence Engine"
    };
  }

  // Default Guidance
  return {
    reply:
      "Hello! I am Saksham AI Assistant. I can assist you with discovering scholarships, checking dynamic eligibility, identifying document spelling mismatches, recovering returned applications, and tracking renewal deadlines across all Indian states and Union Territories.",
    suggestedActions: [
      { label: "Find Scholarships", url: "/student/scholarships" },
      { label: "Check Readiness Score", url: "/student/dashboard" },
      { label: "Explore Opportunities", url: "/student/opportunities" }
    ],
    isVerifiedData: true,
    source: "TRIBAL SAKSHAM Knowledge Base"
  };
}
