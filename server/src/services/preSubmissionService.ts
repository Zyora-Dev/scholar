import { StudentProfile, Scholarship, DocumentItem, Application } from "../types/index.js";

export interface ReadinessResult {
  readinessScore: number;
  readyToSubmit: boolean;
  breakdown: {
    profile: number;
    documents: number;
    eligibility: number;
    form: number;
    verification: number;
  };
  flags: {
    type: "ERROR" | "WARNING" | "INFO";
    message: string;
    field?: string;
    actionableFix?: string;
  }[];
}

export function evaluateApplicationReadiness(
  profile: StudentProfile,
  scholarship: Scholarship,
  userDocuments: DocumentItem[],
  appDraft?: Partial<Application>
): ReadinessResult {
  const flags: {
    type: "ERROR" | "WARNING" | "INFO";
    message: string;
    field?: string;
    actionableFix?: string;
  }[] = [];

  // 1. Profile completeness (20%)
  const profileScore = profile.profileCompletionPercentage || 85;
  if (profileScore < 80) {
    flags.push({
      type: "WARNING",
      message: `Student profile is ${profileScore}% complete. Adding all details improves approval speed.`,
      field: "profile",
      actionableFix: "Complete missing profile sections"
    });
  }

  // 2. Documents check (30%)
  let mandatoryMet = 0;
  let totalMandatory = scholarship.requiredDocuments.filter((d) => d.mandatory).length || 1;

  scholarship.requiredDocuments.forEach((req) => {
    const hasDoc = userDocuments.some(
      (d) => d.documentType === req.documentType && d.status !== "EXPIRED"
    );
    if (hasDoc) {
      if (req.mandatory) mandatoryMet++;
    } else if (req.mandatory) {
      flags.push({
        type: "ERROR",
        message: `Mandatory document missing: ${req.title}`,
        field: req.documentType,
        actionableFix: `Upload ${req.title} to Document Vault`
      });
    }
  });

  const docsScore = Math.round((mandatoryMet / totalMandatory) * 100);

  // Check document mismatches
  userDocuments.forEach((doc) => {
    if (doc.mismatchFlags && doc.mismatchFlags.length > 0) {
      doc.mismatchFlags.forEach((mf) => {
        flags.push({
          type: "WARNING",
          message: `${doc.title}: ${mf.message}`,
          field: mf.field,
          actionableFix: "Verify or attach endorsing revenue affidavit"
        });
      });
    }
  });

  // 3. Eligibility score (25%)
  let eligScore = 100;
  if (profile.annualFamilyIncome > scholarship.maxAnnualIncome) {
    eligScore -= 50;
    flags.push({
      type: "ERROR",
      message: `Income exceeds scheme limit of ₹${scholarship.maxAnnualIncome.toLocaleString(
        "en-IN"
      )}`,
      field: "income"
    });
  }

  // 4. Form and Bank fields (25%)
  let formScore = 90;
  if (!profile.bankAccountReady || !profile.bankAccountNumber) {
    formScore -= 40;
    flags.push({
      type: "ERROR",
      message: "Direct Benefit Transfer (DBT) Bank Account details are incomplete.",
      field: "bankAccount",
      actionableFix: "Fill active bank account number and IFSC"
    });
  }

  // Verification readiness (75%)
  const verificationScore = Math.min(100, Math.round((docsScore + profileScore) / 2));

  // Overall readiness calculation
  const weightedReadiness = Math.round(
    profileScore * 0.2 +
      docsScore * 0.3 +
      eligScore * 0.25 +
      formScore * 0.15 +
      verificationScore * 0.1
  );

  const hasBlockingErrors = flags.some((f) => f.type === "ERROR");

  return {
    readinessScore: Math.min(100, weightedReadiness),
    readyToSubmit: !hasBlockingErrors && weightedReadiness >= 75,
    breakdown: {
      profile: profileScore,
      documents: docsScore,
      eligibility: eligScore,
      form: formScore,
      verification: verificationScore
    },
    flags
  };
}
