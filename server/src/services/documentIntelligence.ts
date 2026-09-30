import { StudentProfile, DocumentItem } from "../types/index.js";

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function analyzeDocumentMismatch(
  profile: StudentProfile,
  doc: DocumentItem
): {
  detected: boolean;
  field: string;
  profileValue: string;
  documentValue: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  message: string;
}[] {
  const flags: {
    detected: boolean;
    field: string;
    profileValue: string;
    documentValue: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    message: string;
  }[] = [];

  const meta = doc.extractedMetadata;
  if (!meta) return flags;

  // 1. Name comparison
  if (meta.candidateName) {
    const profName = profile.fullName.trim().toLowerCase().replace(/\s+/g, " ");
    const docName = meta.candidateName.trim().toLowerCase().replace(/\s+/g, " ");

    if (profName !== docName) {
      const distance = levenshteinDistance(profName, docName);
      if (distance <= 3) {
        flags.push({
          detected: true,
          field: "candidateName",
          profileValue: profile.fullName,
          documentValue: meta.candidateName,
          severity: "MEDIUM",
          message: `Possible spelling variation detected: Profile has "${profile.fullName}" while ${doc.title} indicates "${meta.candidateName}". Manual review recommended.`
        });
      } else {
        flags.push({
          detected: true,
          field: "candidateName",
          profileValue: profile.fullName,
          documentValue: meta.candidateName,
          severity: "HIGH",
          message: `Substantial name difference: Profile has "${profile.fullName}" but document states "${meta.candidateName}". Requires verification.`
        });
      }
    }
  }

  // 2. DOB comparison
  if (meta.dob && profile.dob) {
    if (meta.dob !== profile.dob) {
      flags.push({
        detected: true,
        field: "dob",
        profileValue: profile.dob,
        documentValue: meta.dob,
        severity: "HIGH",
        message: `Date of birth mismatch: Profile (${profile.dob}) vs Document (${meta.dob}). Please recheck records.`
      });
    }
  }

  // 3. Expiry Check
  if (doc.expiryDate) {
    const expiry = new Date(doc.expiryDate);
    const now = new Date();
    if (expiry < now) {
      flags.push({
        detected: true,
        field: "expiryDate",
        profileValue: "Active",
        documentValue: doc.expiryDate,
        severity: "HIGH",
        message: `Document expired on ${doc.expiryDate}. Please upload a recently renewed certificate.`
      });
    }
  }

  return flags;
}
