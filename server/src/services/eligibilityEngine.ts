import { StudentProfile, Scholarship } from "../types/index.js";

export interface EligibilityAssessment {
  status: "Eligible" | "Potentially Eligible" | "Not Eligible" | "Needs Verification";
  matchScore: number;
  breakdown: {
    category: "Match" | "Mismatch";
    course: "Match" | "Partial Match" | "Mismatch";
    income: "Match" | "Exceeded" | "Pending Proof";
    location: "Match" | "Non-Domicile";
    documents: "Complete" | "Incomplete";
  };
  factors: {
    type: "SUCCESS" | "WARNING" | "DANGER";
    message: string;
  }[];
  disclaimer: string;
}

export function evaluateEligibility(
  profile: StudentProfile,
  scholarship: Scholarship,
  userDocumentsCount: number = 0
): EligibilityAssessment {
  const factors: { type: "SUCCESS" | "WARNING" | "DANGER"; message: string }[] = [];
  let score = 0;
  let maxScore = 100;

  // 1. Community check (ST) - 30 points
  let categoryMatch: "Match" | "Mismatch" = "Mismatch";
  if (profile.stCommunity && profile.stCommunity.trim().length > 0) {
    categoryMatch = "Match";
    score += 30;
    factors.push({
      type: "SUCCESS",
      message: `ST category requirement satisfied (Verified Community: ${profile.stCommunity})`
    });
  } else {
    factors.push({
      type: "DANGER",
      message: "Scheduled Tribe certificate or community record missing"
    });
  }

  // 2. Education & Course Match - 25 points
  let courseMatch: "Match" | "Partial Match" | "Mismatch" = "Mismatch";
  const levelMatch =
    scholarship.educationLevels.includes("ALL") ||
    scholarship.educationLevels.includes(profile.educationLevel);
  const courseAllowed =
    scholarship.coursesAllowed.includes("ALL") ||
    scholarship.coursesAllowed.some(
      (c) =>
        profile.course.toLowerCase().includes(c.toLowerCase()) ||
        c.toLowerCase().includes(profile.stream.toLowerCase())
    );

  if (levelMatch && courseAllowed) {
    courseMatch = "Match";
    score += 25;
    factors.push({
      type: "SUCCESS",
      message: `Course and Education level satisfied (${profile.course})`
    });
  } else if (levelMatch) {
    courseMatch = "Partial Match";
    score += 15;
    factors.push({
      type: "WARNING",
      message: `Education level matches (${profile.educationLevel}), but specific course criteria requires institution verification`
    });
  } else {
    factors.push({
      type: "DANGER",
      message: `Current education level (${profile.educationLevel}) does not meet scheme requirements`
    });
  }

  // 3. Family Income Criteria - 25 points
  let incomeMatch: "Match" | "Exceeded" | "Pending Proof" = "Exceeded";
  if (profile.annualFamilyIncome <= scholarship.maxAnnualIncome) {
    if (profile.incomeCertificateAvailable) {
      incomeMatch = "Match";
      score += 25;
      factors.push({
        type: "SUCCESS",
        message: `Income condition satisfied (Declared: ₹${profile.annualFamilyIncome.toLocaleString(
          "en-IN"
        )} ≤ Limit: ₹${scholarship.maxAnnualIncome.toLocaleString("en-IN")})`
      });
    } else {
      incomeMatch = "Pending Proof";
      score += 15;
      factors.push({
        type: "WARNING",
        message: "Income appears within ceiling, but current income certificate is pending upload"
      });
    }
  } else {
    factors.push({
      type: "DANGER",
      message: `Annual family income (₹${profile.annualFamilyIncome.toLocaleString(
        "en-IN"
      )}) exceeds scheme threshold (₹${scholarship.maxAnnualIncome.toLocaleString("en-IN")})`
    });
  }

  // 4. Geographic / Domicile Criteria - 10 points
  let locationMatch: "Match" | "Non-Domicile" = "Non-Domicile";
  const stateMatch =
    scholarship.applicableStates.includes("ALL") ||
    scholarship.applicableStates.includes(profile.state);

  if (stateMatch) {
    locationMatch = "Match";
    score += 10;
    factors.push({
      type: "SUCCESS",
      message: `State condition satisfied (Applicable in ${profile.state})`
    });
  } else {
    factors.push({
      type: "DANGER",
      message: `Scheme only applies to: ${scholarship.applicableStates.join(", ")}`
    });
  }

  // 5. Document Readiness - 10 points
  let docsStatus: "Complete" | "Incomplete" = "Incomplete";
  const minRequiredDocs = scholarship.requiredDocuments.length;
  if (userDocumentsCount >= minRequiredDocs) {
    docsStatus = "Complete";
    score += 10;
    factors.push({
      type: "SUCCESS",
      message: "Mandatory documents appear available in Vault"
    });
  } else {
    factors.push({
      type: "WARNING",
      message: `${minRequiredDocs - userDocumentsCount} recommended documents still missing from Document Vault`
    });
  }

  // Dynamic status evaluation
  let status: "Eligible" | "Potentially Eligible" | "Not Eligible" | "Needs Verification" =
    "Needs Verification";
  if (score >= 85) {
    status = "Eligible";
  } else if (score >= 60) {
    status = "Potentially Eligible";
  } else if (score >= 40) {
    status = "Needs Verification";
  } else {
    status = "Not Eligible";
  }

  return {
    status,
    matchScore: Math.min(100, score),
    breakdown: {
      category: categoryMatch,
      course: courseMatch,
      income: incomeMatch,
      location: locationMatch,
      documents: docsStatus
    },
    factors,
    disclaimer:
      "AI-assisted preliminary assessment. Final eligibility is determined by the authorized authority."
  };
}
