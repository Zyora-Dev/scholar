export type UserRole = "STUDENT" | "INSTITUTION" | "ADMIN" | "SUPER_ADMIN";

export type VerificationStatus = "VERIFIED" | "DEMO" | "PENDING_VERIFICATION" | "EXPIRED";

export type DocumentType =
  | "ST_CERTIFICATE"
  | "INCOME_CERTIFICATE"
  | "AADHAAR_CARD"
  | "COMMUNITY_CERTIFICATE"
  | "MARKSHEET"
  | "BONAFIDE_CERTIFICATE"
  | "BANK_PASSBOOK"
  | "INSTITUTION_ID"
  | "DISABILITY_CERTIFICATE"
  | "PASSPORT_PHOTO"
  | "OTHER";

export type DocumentStatus =
  | "VALID"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "MISSING"
  | "PENDING_VERIFICATION"
  | "REQUIRES_REVIEW";

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "INSTITUTION_VERIFICATION"
  | "INSTITUTION_RECOMMENDED"
  | "DEPARTMENT_REVIEW"
  | "APPROVED"
  | "RETURNED"
  | "REJECTED"
  | "DISBURSED"
  | "RENEWAL";

export type RenewalStatus =
  | "UPCOMING"
  | "WINDOW_OPEN"
  | "SUBMITTED"
  | "VERIFIED"
  | "RENEWED"
  | "OVERDUE";

export type OpportunityType =
  | "SCHOLARSHIP"
  | "FELLOWSHIP"
  | "INTERNSHIP"
  | "SKILL_PROGRAM"
  | "HIGHER_EDUCATION"
  | "COMPETITIVE_EXAM";

export type NotificationCategory = "URGENT" | "IMPORTANT" | "INFORMATION";

export type AIFlagStatus = "NEW" | "UNDER_REVIEW" | "RESOLVED" | "FALSE_POSITIVE";

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  phone?: string;
  institutionId?: string;
  state?: string;
  district?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  mobile: string;
  email: string;
  state: string;
  district: string;
  address: string;
  pincode: string;
  tribalRegion?: string;
  stCommunity: string;
  educationLevel: string;
  course: string;
  stream: string;
  yearOfStudy: number;
  institutionName: string;
  institutionType: "GOVERNMENT" | "AIDED" | "PRIVATE" | "CENTRAL_INSTITUTION";
  gpaOrPercentage: number;
  annualFamilyIncome: number;
  incomeCertificateAvailable: boolean;
  differentlyAbled: boolean;
  disabilityPercentage?: number;
  bankAccountReady: boolean;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  profileCompletionPercentage: number;
  missingItems: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DynamicEligibilityRule {
  field: string;
  operator: "EQUALS" | "NOT_EQUALS" | "LESS_THAN_OR_EQUAL" | "GREATER_THAN_OR_EQUAL" | "IN_LIST";
  value: any;
  description: string;
  mandatory: boolean;
}

export interface RequiredDocumentDef {
  documentType: DocumentType;
  title: string;
  mandatory: boolean;
  description: string;
}

export interface Scholarship {
  id: string;
  name: string;
  tagline: string;
  type: OpportunityType;
  provider: "CENTRAL_GOVERNMENT" | "STATE_GOVERNMENT" | "UGC" | "AICTE" | "PRIVATE_TRUST";
  ministry?: string;
  officialSourceUrl: string;
  sourceName: string;
  sourceType: "OFFICIAL_PORTAL" | "GOVERNMENT_CIRCULAR" | "DEPARTMENTAL_NOTIFICATION" | "DEMO_PORTAL";
  lastVerifiedDate: string;
  verificationStatus: VerificationStatus;
  applicableStates: string[];
  applicableDistricts?: string[];
  educationLevels: string[];
  coursesAllowed: string[];
  maxAnnualIncome: number;
  minAcademicPercentage: number;
  benefitAmountAnnual: number;
  benefitDetails: {
    maintenanceAllowance?: number;
    tuitionFeeReimbursement?: string;
    bookGrant?: number;
    hostelSubsidy?: number;
    totalEstAnnual: number;
  };
  eligibilityRules: DynamicEligibilityRule[];
  requiredDocuments: RequiredDocumentDef[];
  applicationStartDate: string;
  applicationDeadline: string;
  renewalRules: {
    requiresPassMarks: boolean;
    minAttendancePercent: number;
    annualVerification: boolean;
  };
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  userId: string;
  documentType: DocumentType;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  issueDate?: string;
  expiryDate?: string;
  certificateNumber?: string;
  issuingAuthority?: string;
  extractedMetadata?: {
    candidateName?: string;
    dob?: string;
    institution?: string;
    course?: string;
    incomeReported?: number;
    communityReported?: string;
  };
  mismatchFlags?: {
    detected: boolean;
    field: string;
    profileValue: string;
    documentValue: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    message: string;
  }[];
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNotes?: string;
}

export interface ApplicationStatusHistory {
  stage: ApplicationStatus;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  comments?: string;
}

export interface Application {
  id: string;
  applicationNumber: string;
  userId: string;
  scholarshipId: string;
  scholarshipName: string;
  academicYear: string;
  status: ApplicationStatus;
  statusHistory: ApplicationStatusHistory[];
  personalDetails: Record<string, any>;
  educationDetails: Record<string, any>;
  eligibilityDeclaration: Record<string, any>;
  uploadedDocumentIds: string[];
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
    aadhaarLinked: boolean;
  };
  readinessScore: number;
  readinessBreakdown: {
    profile: number;
    documents: number;
    eligibility: number;
    form: number;
    verification: number;
  };
  preSubmissionFlags: {
    type: "ERROR" | "WARNING" | "INFO";
    message: string;
    field?: string;
  }[];
  returnedReason?: string;
  requiredCorrectionDocs?: DocumentType[];
  correctionInstructions?: string[];
  correctionDeadline?: string;
  correctionHistory?: {
    returnedAt: string;
    reason: string;
    fixedAt?: string;
    actionTaken?: string;
  }[];
  institutionVerification?: {
    verifiedBy: string;
    verifiedAt: string;
    academicStatusConfirmed: boolean;
    stStatusConfirmed: boolean;
    bonafideConfirmed: boolean;
    action: "RECOMMENDED" | "RETURNED_FOR_CORRECTION" | "REJECTED";
    remarks: string;
  };
  disbursementDetails?: {
    disbursedAmount: number;
    transactionReference: string;
    disbursedDate: string;
    pfmsStatus: "CREDITED" | "PROCESSING";
  };
  submittedAt?: string;
  lastUpdatedAt: string;
}

export interface RenewalRecord {
  id: string;
  userId: string;
  scholarshipId: string;
  scholarshipName: string;
  originalApplicationId: string;
  currentAcademicYear: string;
  renewalAcademicYear: string;
  renewalDeadline: string;
  status: RenewalStatus;
  daysRemaining: number;
  requiredDocuments: RequiredDocumentDef[];
  uploadedDocumentIds: string[];
  marksheetUploaded: boolean;
  bonafideUploaded: boolean;
  incomeCertificateUploaded: boolean;
  previousYearMarksPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  organization: string;
  location: string;
  state: string;
  stSpecific: boolean;
  stQuotaDetails?: string;
  stipendOrBenefit: string;
  deadline: string;
  eligibility: string;
  officialLink: string;
  verificationStatus: VerificationStatus;
  description: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface AIFlag {
  id: string;
  type: "DUPLICATE_APPLICATION" | "DOCUMENT_MISMATCH" | "ANOMALOUS_INCOME" | "SUSPICIOUS_PATTERN";
  severity: "HIGH" | "MEDIUM" | "LOW";
  status: AIFlagStatus;
  studentId: string;
  studentName: string;
  applicationId?: string;
  description: string;
  confidenceScore: number;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  previousState?: any;
  newState?: any;
  ipAddress?: string;
  timestamp: string;
}
