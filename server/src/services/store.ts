import {
  User,
  StudentProfile,
  Scholarship,
  Application,
  DocumentItem,
  RenewalRecord,
  Opportunity,
  NotificationItem,
  AIFlag,
  AuditLog
} from "../types/index.js";

export class MemoryStore {
  users: User[] = [];
  studentProfiles: StudentProfile[] = [];
  scholarships: Scholarship[] = [];
  applications: Application[] = [];
  documents: DocumentItem[] = [];
  renewals: RenewalRecord[] = [];
  opportunities: Opportunity[] = [];
  notifications: NotificationItem[] = [];
  aiFlags: AIFlag[] = [];
  auditLogs: AuditLog[] = [];
  states: { code: string; name: string; tribalPopPercentage: number }[] = [];
  districts: { stateCode: string; name: string; isTribalRegion: boolean; majorTribes: string[] }[] = [];

  constructor() {
    this.initMasterData();
    this.initUsersAndProfiles();
    this.initScholarships();
    this.initDocumentsAndApplications();
    this.initRenewalsOpportunitiesAndAudit();
  }
  private initMasterData() {
    this.states = [
      { code: "TN", name: "Tamil Nadu", tribalPopPercentage: 1.1 },
      { code: "OD", name: "Odisha", tribalPopPercentage: 22.8 },
      { code: "JH", name: "Jharkhand", tribalPopPercentage: 26.2 },
      { code: "MP", name: "Madhya Pradesh", tribalPopPercentage: 21.1 },
      { code: "CG", name: "Chhattisgarh", tribalPopPercentage: 30.6 },
      { code: "MH", name: "Maharashtra", tribalPopPercentage: 9.4 },
      { code: "AP", name: "Andhra Pradesh", tribalPopPercentage: 5.3 },
      { code: "KL", name: "Kerala", tribalPopPercentage: 1.5 },
      { code: "AS", name: "Assam", tribalPopPercentage: 12.4 },
      { code: "ML", name: "Meghalaya", tribalPopPercentage: 86.1 },
      { code: "NL", name: "Nagaland", tribalPopPercentage: 86.5 },
      { code: "MZ", name: "Mizoram", tribalPopPercentage: 94.4 },
      { code: "TR", name: "Tripura", tribalPopPercentage: 31.8 },
      { code: "AR", name: "Arunachal Pradesh", tribalPopPercentage: 68.8 },
      { code: "MN", name: "Manipur", tribalPopPercentage: 35.1 },
      { code: "GJ", name: "Gujarat", tribalPopPercentage: 14.8 },
      { code: "RJ", name: "Rajasthan", tribalPopPercentage: 13.5 },
      { code: "HP", name: "Himachal Pradesh", tribalPopPercentage: 5.7 },
      { code: "JK", name: "Jammu and Kashmir", tribalPopPercentage: 11.9 },
      { code: "LA", name: "Ladakh", tribalPopPercentage: 79.5 },
      { code: "TS", name: "Telangana", tribalPopPercentage: 9.08 },
      { code: "KA", name: "Karnataka", tribalPopPercentage: 7.0 },
      { code: "WB", name: "West Bengal", tribalPopPercentage: 5.8 },
      { code: "BR", name: "Bihar", tribalPopPercentage: 1.3 },
      { code: "UP", name: "Uttar Pradesh", tribalPopPercentage: 0.6 },
      { code: "UK", name: "Uttarakhand", tribalPopPercentage: 2.9 },
      { code: "SK", name: "Sikkim", tribalPopPercentage: 33.8 },
      { code: "GA", name: "Goa", tribalPopPercentage: 10.2 },
      { code: "AN", name: "Andaman and Nicobar Islands", tribalPopPercentage: 8.0 },
      { code: "DL", name: "Delhi", tribalPopPercentage: 0.0 }
    ];

    this.districts = [
      { stateCode: "TN", name: "Nilgiris", isTribalRegion: true, majorTribes: ["Toda", "Kota", "Kurumba", "Irula", "Paniyan"] },
      { stateCode: "TN", name: "Salem", isTribalRegion: true, majorTribes: ["Malayali"] },
      { stateCode: "TN", name: "Namakkal", isTribalRegion: true, majorTribes: ["Malayali"] },
      { stateCode: "TN", name: "Dharmapuri", isTribalRegion: true, majorTribes: ["Kurumbas", "Irulas"] },
      { stateCode: "TN", name: "Chennai", isTribalRegion: false, majorTribes: ["Irula"] },
      { stateCode: "OD", name: "Koraput", isTribalRegion: true, majorTribes: ["Kondh", "Paroja", "Bhatra"] },
      { stateCode: "OD", name: "Mayurbhanj", isTribalRegion: true, majorTribes: ["Santhal", "Kolha", "Ho"] },
      { stateCode: "OD", name: "Rayagada", isTribalRegion: true, majorTribes: ["Dongria Kondh", "Saora"] },
      { stateCode: "JH", name: "Ranchi", isTribalRegion: true, majorTribes: ["Munda", "Oraon"] },
      { stateCode: "JH", name: "Khunti", isTribalRegion: true, majorTribes: ["Munda"] },
      { stateCode: "JH", name: "Pashchimi Singhbhum", isTribalRegion: true, majorTribes: ["Ho", "Santhal"] },
      { stateCode: "MP", name: "Dindori", isTribalRegion: true, majorTribes: ["Baiga", "Gond"] },
      { stateCode: "MP", name: "Jhabua", isTribalRegion: true, majorTribes: ["Bhil", "Bhilala"] },
      { stateCode: "MP", name: "Mandla", isTribalRegion: true, majorTribes: ["Gond", "Baiga"] },
      { stateCode: "CG", name: "Bastar", isTribalRegion: true, majorTribes: ["Maria", "Muria", "Gond", "Halba"] },
      { stateCode: "CG", name: "Dantewada", isTribalRegion: true, majorTribes: ["Dandami Maria"] },
      { stateCode: "MH", name: "Gadchiroli", isTribalRegion: true, majorTribes: ["Madia Gond", "Pradhan"] },
      { stateCode: "MH", name: "Nandurbar", isTribalRegion: true, majorTribes: ["Bhil", "Pawra"] },
      { stateCode: "KL", name: "Wayanad", isTribalRegion: true, majorTribes: ["Paniyan", "Kurichiyan", "Kuruman"] },
      { stateCode: "AP", name: "Alluri Sitharama Raju", isTribalRegion: true, majorTribes: ["Koya", "Konda Reddi"] },
      { stateCode: "TS", name: "Adilabad", isTribalRegion: true, majorTribes: ["Gond", "Pardhan", "Kolam"] }
    ];
  }

  private initUsersAndProfiles() {
    this.users = [
      {
        id: "usr-student-01",
        email: "student@demo.saksham.gov.in",
        name: "Indhira Iyappan",
        role: "STUDENT",
        phone: "+91 98765 43210",
        state: "Tamil Nadu",
        district: "Nilgiris",
        createdAt: "2025-08-01T10:00:00Z",
        updatedAt: "2026-09-01T10:00:00Z"
      },
      {
        id: "usr-inst-01",
        email: "institution@demo.saksham.gov.in",
        name: "Dr. A. Ramesh (Nodal Officer)",
        role: "INSTITUTION",
        phone: "+91 94433 22110",
        institutionId: "inst-001",
        state: "Tamil Nadu",
        district: "Nilgiris",
        createdAt: "2025-08-01T10:00:00Z",
        updatedAt: "2026-09-01T10:00:00Z"
      },
      {
        id: "usr-admin-01",
        email: "admin@demo.saksham.gov.in",
        name: "Tribal Welfare State Admin",
        role: "ADMIN",
        phone: "+91 94440 12345",
        state: "Tamil Nadu",
        createdAt: "2025-08-01T10:00:00Z",
        updatedAt: "2026-09-01T10:00:00Z"
      },
      {
        id: "usr-superadmin-01",
        email: "superadmin@demo.saksham.gov.in",
        name: "National Super Administrator",
        role: "SUPER_ADMIN",
        phone: "+91 99999 88888",
        createdAt: "2025-08-01T10:00:00Z",
        updatedAt: "2026-09-01T10:00:00Z"
      }
    ];

    this.studentProfiles = [
      {
        id: "prof-student-01",
        userId: "usr-student-01",
        fullName: "Indhira Iyappan",
        dob: "2004-06-15",
        gender: "FEMALE",
        mobile: "+91 98765 43210",
        email: "student@demo.saksham.gov.in",
        state: "Tamil Nadu",
        district: "Nilgiris",
        address: "Door 4/12, Kotagiri Tribal Settlement, Nilgiris District",
        pincode: "643217",
        tribalRegion: "Nilgiris Biosphere Tribal Settlement",
        stCommunity: "Irula",
        educationLevel: "UNDERGRADUATE",
        course: "B.Tech Computer Science and Engineering",
        stream: "Engineering & Technology",
        yearOfStudy: 3,
        institutionName: "Government College of Technology, Coimbatore",
        institutionType: "GOVERNMENT",
        gpaOrPercentage: 84.5,
        annualFamilyIncome: 140000,
        incomeCertificateAvailable: true,
        differentlyAbled: false,
        bankAccountReady: true,
        bankAccountNumber: "50100456789123",
        bankIfsc: "SBIN0001234",
        bankName: "State Bank of India (Kotagiri Branch)",
        profileCompletionPercentage: 92,
        missingItems: ["Income Certificate Re-verification"],
        createdAt: "2025-08-05T10:00:00Z",
        updatedAt: "2026-09-15T14:30:00Z"
      }
    ];
  }
  private initScholarships() {
    this.scholarships = [
      {
        id: "sch-001",
        name: "Post-Matric Scholarship for ST Students (Centrally Sponsored)",
        tagline: "Comprehensive financial support for ST students pursuing post-secondary education",
        type: "SCHOLARSHIP",
        provider: "CENTRAL_GOVERNMENT",
        ministry: "Ministry of Tribal Affairs",
        officialSourceUrl: "https://tribal.nic.in/PostMatric.aspx",
        sourceName: "National Scholarship Portal (NSP) / Ministry of Tribal Affairs",
        sourceType: "OFFICIAL_PORTAL",
        lastVerifiedDate: "2026-08-15",
        verificationStatus: "VERIFIED",
        applicableStates: ["ALL"],
        educationLevels: ["HIGHER_SECONDARY", "DIPLOMA", "UNDERGRADUATE", "POSTGRADUATE", "PHD"],
        coursesAllowed: ["ALL"],
        maxAnnualIncome: 250000,
        minAcademicPercentage: 50,
        benefitAmountAnnual: 65000,
        benefitDetails: {
          maintenanceAllowance: 38000,
          tuitionFeeReimbursement: "100% of standard government fee",
          bookGrant: 7000,
          hostelSubsidy: 20000,
          totalEstAnnual: 65000
        },
        eligibilityRules: [
          { field: "stCommunity", operator: "NOT_EQUALS", value: "", description: "Must belong to Scheduled Tribe (ST)", mandatory: true },
          { field: "annualFamilyIncome", operator: "LESS_THAN_OR_EQUAL", value: 250000, description: "Annual family income must not exceed ₹2,50,000", mandatory: true },
          { field: "gpaOrPercentage", operator: "GREATER_THAN_OR_EQUAL", value: 50, description: "Minimum 50% marks in qualifying exam", mandatory: true }
        ],
        requiredDocuments: [
          { documentType: "ST_CERTIFICATE", title: "ST Community Certificate", mandatory: true, description: "Issued by revenue authority" },
          { documentType: "INCOME_CERTIFICATE", title: "Current Income Certificate", mandatory: true, description: "Issued within last 12 months" },
          { documentType: "MARKSHEET", title: "Previous Year Marksheet", mandatory: true, description: "Qualifying marksheet" },
          { documentType: "BONAFIDE_CERTIFICATE", title: "Bonafide Student Certificate", mandatory: true, description: "Signed by Head of Institution" },
          { documentType: "BANK_PASSBOOK", title: "Aadhaar-seeded Bank Passbook", mandatory: true, description: "Student's active account" }
        ],
        applicationStartDate: "2026-07-01",
        applicationDeadline: "2026-10-31",
        renewalRules: { requiresPassMarks: true, minAttendancePercent: 75, annualVerification: true },
        description: "Primary objective is to provide financial assistance to Scheduled Tribe students studying at post-secondary stage.",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2026-08-15T00:00:00Z"
      },
      {
        id: "sch-002",
        name: "National Overseas Scholarship for ST Candidates",
        tagline: "Assistance to meritorious ST students for pursuing Master and Ph.D. level courses abroad",
        type: "SCHOLARSHIP",
        provider: "CENTRAL_GOVERNMENT",
        ministry: "Ministry of Tribal Affairs",
        officialSourceUrl: "https://overseas.tribal.gov.in",
        sourceName: "Ministry of Tribal Affairs Portal",
        sourceType: "OFFICIAL_PORTAL",
        lastVerifiedDate: "2026-07-20",
        verificationStatus: "VERIFIED",
        applicableStates: ["ALL"],
        educationLevels: ["POSTGRADUATE", "PHD"],
        coursesAllowed: ["Engineering", "Medicine", "Pure Sciences", "Agricultural Sciences", "Humanities & Social Sciences"],
        maxAnnualIncome: 600000,
        minAcademicPercentage: 60,
        benefitAmountAnnual: 1850000,
        benefitDetails: {
          maintenanceAllowance: 1200000,
          tuitionFeeReimbursement: "Full actual tuition fee directly paid to foreign university",
          bookGrant: 50000,
          totalEstAnnual: 1850000
        },
        eligibilityRules: [
          { field: "stCommunity", operator: "NOT_EQUALS", value: "", description: "Must belong to Scheduled Tribe (ST)", mandatory: true },
          { field: "annualFamilyIncome", operator: "LESS_THAN_OR_EQUAL", value: 600000, description: "Total family income under ₹6,00,000", mandatory: true },
          { field: "gpaOrPercentage", operator: "GREATER_THAN_OR_EQUAL", value: 60, description: "Minimum 60% grade in qualifying degree", mandatory: true }
        ],
        requiredDocuments: [
          { documentType: "ST_CERTIFICATE", title: "ST Certificate", mandatory: true, description: "Official ST Certificate" },
          { documentType: "INCOME_CERTIFICATE", title: "Verified Income Certificate", mandatory: true, description: "Household income proof" },
          { documentType: "MARKSHEET", title: "Degree Transcripts", mandatory: true, description: "Attested transcripts" },
          { documentType: "OTHER", title: "Foreign University Offer Letter", mandatory: true, description: "Admission memo from top QS university" }
        ],
        applicationStartDate: "2026-06-01",
        applicationDeadline: "2026-11-15",
        renewalRules: { requiresPassMarks: true, minAttendancePercent: 80, annualVerification: true },
        description: "Assists ST scholars wishing to pursue higher studies abroad in Master level courses and Ph.D. programs.",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2026-07-20T00:00:00Z"
      },
      {
        id: "sch-003",
        name: "National Fellowship and Scholarship for Higher Education of ST Students (NFST)",
        tagline: "Fellowship for ST students to pursue M.Phil & Ph.D. degrees in Indian Universities",
        type: "FELLOWSHIP",
        provider: "CENTRAL_GOVERNMENT",
        ministry: "Ministry of Tribal Affairs",
        officialSourceUrl: "https://fellowship.tribal.gov.in",
        sourceName: "Ministry of Tribal Affairs Fellowship Division",
        sourceType: "OFFICIAL_PORTAL",
        lastVerifiedDate: "2026-08-10",
        verificationStatus: "VERIFIED",
        applicableStates: ["ALL"],
        educationLevels: ["PHD"],
        coursesAllowed: ["ALL"],
        maxAnnualIncome: 600000,
        minAcademicPercentage: 55,
        benefitAmountAnnual: 420000,
        benefitDetails: {
          maintenanceAllowance: 372000,
          bookGrant: 28000,
          hostelSubsidy: 20000,
          totalEstAnnual: 420000
        },
        eligibilityRules: [
          { field: "stCommunity", operator: "NOT_EQUALS", value: "", description: "Must belong to Scheduled Tribe", mandatory: true },
          { field: "educationLevel", operator: "EQUALS", value: "PHD", description: "Enrolled in regular full-time Ph.D.", mandatory: true }
        ],
        requiredDocuments: [
          { documentType: "ST_CERTIFICATE", title: "ST Certificate", mandatory: true, description: "Valid ST Certificate" },
          { documentType: "BONAFIDE_CERTIFICATE", title: "Ph.D. Admission Slip", mandatory: true, description: "University Registrar seal" },
          { documentType: "OTHER", title: "Research Synopsis & Guide Approval", mandatory: true, description: "Approved research synopsis" }
        ],
        applicationStartDate: "2026-08-01",
        applicationDeadline: "2026-11-30",
        renewalRules: { requiresPassMarks: true, minAttendancePercent: 80, annualVerification: true },
        description: "Provides financial assistance to ST candidates every year to pursue M.Phil/Ph.D. research across disciplines.",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2026-08-10T00:00:00Z"
      },
      {
        id: "sch-004",
        name: "Top Class Education Scheme for ST Students",
        tagline: "Full financial coverage at 250+ premier institutions (IITs, NITs, IIMs, AIIMS, NLUs)",
        type: "SCHOLARSHIP",
        provider: "CENTRAL_GOVERNMENT",
        ministry: "Ministry of Tribal Affairs",
        officialSourceUrl: "https://tribal.nic.in/TopClass.aspx",
        sourceName: "National Scholarship Portal",
        sourceType: "OFFICIAL_PORTAL",
        lastVerifiedDate: "2026-08-05",
        verificationStatus: "VERIFIED",
        applicableStates: ["ALL"],
        educationLevels: ["UNDERGRADUATE", "POSTGRADUATE"],
        coursesAllowed: ["Engineering", "Medicine", "Management", "Law", "Commercial Pilot"],
        maxAnnualIncome: 600000,
        minAcademicPercentage: 60,
        benefitAmountAnnual: 220000,
        benefitDetails: {
          maintenanceAllowance: 36000,
          tuitionFeeReimbursement: "Full tuition fee & non-refundable charges up to ₹2.5L",
          bookGrant: 45000,
          totalEstAnnual: 220000
        },
        eligibilityRules: [
          { field: "stCommunity", operator: "NOT_EQUALS", value: "", description: "Candidate must belong to Scheduled Tribe", mandatory: true },
          { field: "annualFamilyIncome", operator: "LESS_THAN_OR_EQUAL", value: 600000, description: "Family income under ₹6.00 Lakh", mandatory: true }
        ],
        requiredDocuments: [
          { documentType: "ST_CERTIFICATE", title: "ST Certificate", mandatory: true, description: "ST Certificate" },
          { documentType: "INCOME_CERTIFICATE", title: "Income Certificate", mandatory: true, description: "Income Certificate" },
          { documentType: "BONAFIDE_CERTIFICATE", title: "Institute Admission Letter", mandatory: true, description: "Allotment memo for premier institute" }
        ],
        applicationStartDate: "2026-07-15",
        applicationDeadline: "2026-10-31",
        renewalRules: { requiresPassMarks: true, minAttendancePercent: 75, annualVerification: true },
        description: "Encourages meritorious ST students to pursue higher studies in premier national institutions.",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2026-08-05T00:00:00Z"
      },
      {
        id: "sch-005",
        name: "Tamil Nadu Adi Dravidar and Tribal Welfare Special Scholarship",
        tagline: "State government maintenance allowance for tribal students in colleges & polytechnics",
        type: "SCHOLARSHIP",
        provider: "STATE_GOVERNMENT",
        ministry: "Adi Dravidar and Tribal Welfare Department, Govt. of Tamil Nadu",
        officialSourceUrl: "https://adwscholarship.tn.gov.in",
        sourceName: "Govt of Tamil Nadu ADW Portal",
        sourceType: "OFFICIAL_PORTAL",
        lastVerifiedDate: "2026-08-25",
        verificationStatus: "VERIFIED",
        applicableStates: ["Tamil Nadu"],
        educationLevels: ["DIPLOMA", "UNDERGRADUATE", "POSTGRADUATE"],
        coursesAllowed: ["ALL"],
        maxAnnualIncome: 250000,
        minAcademicPercentage: 45,
        benefitAmountAnnual: 18000,
        benefitDetails: {
          maintenanceAllowance: 12000,
          bookGrant: 6000,
          totalEstAnnual: 18000
        },
        eligibilityRules: [
          { field: "stCommunity", operator: "NOT_EQUALS", value: "", description: "Must belong to Tamil Nadu Scheduled Tribe list", mandatory: true },
          { field: "state", operator: "EQUALS", value: "Tamil Nadu", description: "Native resident of Tamil Nadu", mandatory: true },
          { field: "annualFamilyIncome", operator: "LESS_THAN_OR_EQUAL", value: 250000, description: "Annual income below ₹2.50 Lakh", mandatory: true }
        ],
        requiredDocuments: [
          { documentType: "ST_CERTIFICATE", title: "ST Community Certificate", mandatory: true, description: "RDO issued" },
          { documentType: "INCOME_CERTIFICATE", title: "Current Income Certificate", mandatory: true, description: "Issued by Tahsildar" },
          { documentType: "BONAFIDE_CERTIFICATE", title: "Bonafide & Attendance Certificate", mandatory: true, description: "From TN college" }
        ],
        applicationStartDate: "2026-08-01",
        applicationDeadline: "2026-11-20",
        renewalRules: { requiresPassMarks: true, minAttendancePercent: 75, annualVerification: true },
        description: "Special state-level scholarship provided to Scheduled Tribe students of Tamil Nadu undergoing diploma and degree courses.",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2026-08-25T00:00:00Z"
      },
      {
        id: "sch-006",
        name: "Birsa Munda Research Fellowship in Tribal Heritage (Sample Track)",
        tagline: "Fellowship for research scholars documenting endangered tribal languages and traditional lore",
        type: "FELLOWSHIP",
        provider: "PRIVATE_TRUST",
        officialSourceUrl: "https://demo.saksham.gov.in/sample-programs/birsa-munda-fellowship",
        sourceName: "National Tribal Research Institute (Demonstration Track)",
        sourceType: "DEMO_PORTAL",
        lastVerifiedDate: "2026-09-01",
        verificationStatus: "DEMO",
        applicableStates: ["ALL"],
        educationLevels: ["POSTGRADUATE", "PHD"],
        coursesAllowed: ["Linguistics", "Anthropology", "Social Sciences", "Cultural Studies", "History"],
        maxAnnualIncome: 450000,
        minAcademicPercentage: 60,
        benefitAmountAnnual: 360000,
        benefitDetails: {
          maintenanceAllowance: 300000,
          bookGrant: 35000,
          totalEstAnnual: 360000
        },
        eligibilityRules: [
          { field: "stCommunity", operator: "NOT_EQUALS", value: "", description: "Open to researchers from Scheduled Tribe communities", mandatory: true }
        ],
        requiredDocuments: [
          { documentType: "ST_CERTIFICATE", title: "ST Certificate", mandatory: true, description: "Official ST Certificate" },
          { documentType: "OTHER", title: "Research Proposal on Tribal Culture", mandatory: true, description: "Detailed synopsis" }
        ],
        applicationStartDate: "2026-08-15",
        applicationDeadline: "2026-12-15",
        renewalRules: { requiresPassMarks: true, minAttendancePercent: 75, annualVerification: true },
        description: "A demonstration fellowship supporting scholars documenting oral traditions and traditional knowledge.",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2026-09-01T00:00:00Z"
      }
    ];
  }
  private initDocumentsAndApplications() {
    this.documents = [
      {
        id: "doc-001",
        userId: "usr-student-01",
        documentType: "ST_CERTIFICATE",
        title: "Scheduled Tribe Community Certificate",
        fileName: "indhira_st_certificate_nilgiris.pdf",
        fileUrl: "/uploads/indhira_st_certificate.pdf",
        fileSize: 184520,
        mimeType: "application/pdf",
        status: "VALID",
        issueDate: "2021-04-12",
        certificateNumber: "TN-RDO-NIL-2021-08492",
        issuingAuthority: "Revenue Divisional Officer, Coonoor, Nilgiris",
        extractedMetadata: {
          candidateName: "Indhira Iyappan",
          dob: "2004-06-15",
          communityReported: "Irula"
        },
        mismatchFlags: [],
        uploadedAt: "2025-08-10T11:00:00Z",
        verifiedAt: "2025-08-15T14:00:00Z",
        verifiedBy: "Dr. A. Ramesh (Nodal Officer)",
        verificationNotes: "Original document verified against Tamil Nadu e-District portal database."
      },
      {
        id: "doc-002",
        userId: "usr-student-01",
        documentType: "INCOME_CERTIFICATE",
        title: "Annual Family Income Certificate",
        fileName: "income_certificate_2025_tahsildar.pdf",
        fileUrl: "/uploads/income_certificate_2025.pdf",
        fileSize: 215400,
        mimeType: "application/pdf",
        status: "REQUIRES_REVIEW",
        issueDate: "2025-03-20",
        expiryDate: "2026-03-19",
        certificateNumber: "TN-INC-KOT-2025-44910",
        issuingAuthority: "Tahsildar, Kotagiri Taluk",
        extractedMetadata: {
          candidateName: "Indhira Iyyappan",
          dob: "2004-06-15",
          incomeReported: 140000
        },
        mismatchFlags: [
          {
            detected: true,
            field: "candidateName",
            profileValue: "Indhira Iyappan",
            documentValue: "Indhira Iyyappan",
            severity: "MEDIUM",
            message: "Spelling variation detected between Profile ('Indhira Iyappan') and Income Certificate ('Indhira Iyyappan'). Human verification recommended."
          }
        ],
        uploadedAt: "2025-08-12T15:30:00Z"
      },
      {
        id: "doc-003",
        userId: "usr-student-01",
        documentType: "MARKSHEET",
        title: "Semester 4 Consolidated Marksheet",
        fileName: "gct_semester_4_grade_sheet.pdf",
        fileUrl: "/uploads/gct_semester_4.pdf",
        fileSize: 312000,
        mimeType: "application/pdf",
        status: "VALID",
        issueDate: "2025-06-30",
        certificateNumber: "GCT-COE-2025-UG-8821",
        issuingAuthority: "Controller of Examinations, Govt College of Technology",
        extractedMetadata: {
          candidateName: "Indhira Iyappan",
          institution: "Government College of Technology, Coimbatore",
          course: "B.Tech Computer Science and Engineering"
        },
        mismatchFlags: [],
        uploadedAt: "2025-08-15T09:20:00Z",
        verifiedAt: "2025-08-16T11:00:00Z"
      },
      {
        id: "doc-004",
        userId: "usr-student-01",
        documentType: "BONAFIDE_CERTIFICATE",
        title: "Current Academic Year Bonafide Certificate",
        fileName: "bonafide_gct_2025_2026.pdf",
        fileUrl: "/uploads/bonafide_2025.pdf",
        fileSize: 142000,
        mimeType: "application/pdf",
        status: "VALID",
        issueDate: "2025-07-10",
        certificateNumber: "GCT-PRI-2025-BON-412",
        issuingAuthority: "Principal, Govt College of Technology",
        extractedMetadata: {
          candidateName: "Indhira Iyappan",
          institution: "Government College of Technology, Coimbatore"
        },
        mismatchFlags: [],
        uploadedAt: "2025-08-16T10:00:00Z",
        verifiedAt: "2025-08-17T09:30:00Z"
      },
      {
        id: "doc-005",
        userId: "usr-student-01",
        documentType: "BANK_PASSBOOK",
        title: "SBI Aadhaar-Seeded Bank Passbook",
        fileName: "sbi_kotagiri_passbook_firstpage.pdf",
        fileUrl: "/uploads/sbi_passbook.pdf",
        fileSize: 260000,
        mimeType: "application/pdf",
        status: "VALID",
        certificateNumber: "50100456789123",
        issuingAuthority: "State Bank of India, Kotagiri",
        extractedMetadata: { candidateName: "Indhira Iyappan" },
        mismatchFlags: [],
        uploadedAt: "2025-08-18T16:00:00Z"
      }
    ];

    this.applications = [
      {
        id: "app-001",
        applicationNumber: "SAKSHAM-2025-TN-00892",
        userId: "usr-student-01",
        scholarshipId: "sch-001",
        scholarshipName: "Post-Matric Scholarship for ST Students (Centrally Sponsored)",
        academicYear: "2024-2025",
        status: "DISBURSED",
        statusHistory: [
          { stage: "DRAFT", timestamp: "2024-08-01T10:00:00Z", actorRole: "STUDENT", actorName: "Indhira Iyappan", comments: "Draft created" },
          { stage: "SUBMITTED", timestamp: "2024-08-15T12:00:00Z", actorRole: "STUDENT", actorName: "Indhira Iyappan", comments: "Submitted successfully" },
          { stage: "INSTITUTION_VERIFICATION", timestamp: "2024-08-20T11:00:00Z", actorRole: "INSTITUTION", actorName: "Dr. A. Ramesh", comments: "Physical documents verified" },
          { stage: "INSTITUTION_RECOMMENDED", timestamp: "2024-08-22T14:30:00Z", actorRole: "INSTITUTION", actorName: "Dr. A. Ramesh", comments: "Recommended for state department approval" },
          { stage: "DEPARTMENT_REVIEW", timestamp: "2024-09-05T10:00:00Z", actorRole: "ADMIN", actorName: "Tribal Welfare State Admin", comments: "Departmental sanction order generated" },
          { stage: "APPROVED", timestamp: "2024-09-18T16:00:00Z", actorRole: "ADMIN", actorName: "Tribal Welfare State Admin", comments: "Approved for direct DBT payment" },
          { stage: "DISBURSED", timestamp: "2024-10-02T10:15:00Z", actorRole: "ADMIN", actorName: "PFMS Direct Benefit Transfer", comments: "Credit acknowledged by State Bank of India" }
        ],
        personalDetails: { fullName: "Indhira Iyappan", gender: "FEMALE", dob: "2004-06-15", community: "Irula", state: "Tamil Nadu", district: "Nilgiris" },
        educationDetails: { institution: "Government College of Technology, Coimbatore", course: "B.Tech Computer Science and Engineering", year: 2, percentage: 82.0 },
        eligibilityDeclaration: { stVerified: true, incomeUnderCeiling: true, noOtherGovtScholarshipClaimed: true },
        uploadedDocumentIds: ["doc-001", "doc-002", "doc-003", "doc-004", "doc-005"],
        bankDetails: { accountHolderName: "Indhira Iyappan", accountNumber: "50100456789123", ifscCode: "SBIN0001234", bankName: "State Bank of India", branchName: "Kotagiri", aadhaarLinked: true },
        readinessScore: 100,
        readinessBreakdown: { profile: 100, documents: 100, eligibility: 100, form: 100, verification: 100 },
        preSubmissionFlags: [],
        disbursementDetails: { disbursedAmount: 65000, transactionReference: "PFMS-2024-TXN-849102384", disbursedDate: "2024-10-02", pfmsStatus: "CREDITED" },
        submittedAt: "2024-08-15T12:00:00Z",
        lastUpdatedAt: "2024-10-02T10:15:00Z"
      },
      {
        id: "app-002",
        applicationNumber: "SAKSHAM-2025-TN-01449",
        userId: "usr-student-01",
        scholarshipId: "sch-002",
        scholarshipName: "National Overseas Scholarship for ST Candidates",
        academicYear: "2025-2026",
        status: "RETURNED",
        statusHistory: [
          { stage: "DRAFT", timestamp: "2025-07-02T10:00:00Z", actorRole: "STUDENT", actorName: "Indhira Iyappan" },
          { stage: "SUBMITTED", timestamp: "2025-07-18T15:00:00Z", actorRole: "STUDENT", actorName: "Indhira Iyappan" },
          { stage: "INSTITUTION_VERIFICATION", timestamp: "2025-07-25T11:00:00Z", actorRole: "INSTITUTION", actorName: "Dr. A. Ramesh" },
          {
            stage: "RETURNED",
            timestamp: "2025-08-01T14:20:00Z",
            actorRole: "INSTITUTION",
            actorName: "Dr. A. Ramesh",
            comments: "Income certificate spelling mismatch detected ('Indhira Iyyappan' vs 'Indhira Iyappan') and requires fresh Tahsildar clarification endorsement. Please re-upload updated document."
          }
        ],
        personalDetails: { fullName: "Indhira Iyappan", gender: "FEMALE", dob: "2004-06-15", community: "Irula", state: "Tamil Nadu", district: "Nilgiris" },
        educationDetails: { institution: "Government College of Technology, Coimbatore", course: "B.Tech Computer Science and Engineering", year: 3, percentage: 84.5 },
        eligibilityDeclaration: { stVerified: true, incomeUnderCeiling: true },
        uploadedDocumentIds: ["doc-001", "doc-002", "doc-003"],
        bankDetails: { accountHolderName: "Indhira Iyappan", accountNumber: "50100456789123", ifscCode: "SBIN0001234", bankName: "State Bank of India", branchName: "Kotagiri", aadhaarLinked: true },
        readinessScore: 82,
        readinessBreakdown: { profile: 100, documents: 60, eligibility: 95, form: 85, verification: 70 },
        preSubmissionFlags: [
          { type: "WARNING", message: "Document spelling variation flagged by verification committee.", field: "incomeCertificate" }
        ],
        returnedReason: "Income Certificate has minor name spelling variation ('Indhira Iyyappan') compared with Aadhaar/Matriculation records ('Indhira Iyappan').",
        requiredCorrectionDocs: ["INCOME_CERTIFICATE"],
        correctionInstructions: [
          "Obtain an updated or endorsed Income Certificate from the Taluk Revenue Office confirming single identity.",
          "Upload the updated document in the Document Vault.",
          "Check that candidate name accurately reflects 'Indhira Iyappan'.",
          "Click 'Fix & Resubmit' below to send back to Institution Verification queue."
        ],
        correctionDeadline: "2026-10-25",
        correctionHistory: [
          { returnedAt: "2025-08-01T14:20:00Z", reason: "Income certificate spelling mismatch requires review endorsement." }
        ],
        submittedAt: "2025-07-18T15:00:00Z",
        lastUpdatedAt: "2025-08-01T14:20:00Z"
      },
      {
        id: "app-003",
        applicationNumber: "SAKSHAM-2025-TN-02911",
        userId: "usr-student-01",
        scholarshipId: "sch-004",
        scholarshipName: "Top Class Education Scheme for ST Students",
        academicYear: "2025-2026",
        status: "INSTITUTION_VERIFICATION",
        statusHistory: [
          { stage: "DRAFT", timestamp: "2025-08-20T10:00:00Z", actorRole: "STUDENT", actorName: "Indhira Iyappan" },
          { stage: "SUBMITTED", timestamp: "2025-08-28T16:30:00Z", actorRole: "STUDENT", actorName: "Indhira Iyappan", comments: "Application submitted with complete attachments" }
        ],
        personalDetails: { fullName: "Indhira Iyappan", gender: "FEMALE", dob: "2004-06-15", community: "Irula", state: "Tamil Nadu", district: "Nilgiris" },
        educationDetails: { institution: "Government College of Technology, Coimbatore", course: "B.Tech Computer Science and Engineering", year: 3, percentage: 84.5 },
        eligibilityDeclaration: { stVerified: true, incomeUnderCeiling: true },
        uploadedDocumentIds: ["doc-001", "doc-003", "doc-004", "doc-005"],
        bankDetails: { accountHolderName: "Indhira Iyappan", accountNumber: "50100456789123", ifscCode: "SBIN0001234", bankName: "State Bank of India", branchName: "Kotagiri", aadhaarLinked: true },
        readinessScore: 94,
        readinessBreakdown: { profile: 100, documents: 90, eligibility: 95, form: 95, verification: 90 },
        preSubmissionFlags: [],
        submittedAt: "2025-08-28T16:30:00Z",
        lastUpdatedAt: "2025-08-28T16:30:00Z"
      }
    ];
  }
  private initRenewalsOpportunitiesAndAudit() {
    this.renewals = [
      {
        id: "ren-001",
        userId: "usr-student-01",
        scholarshipId: "sch-001",
        scholarshipName: "Post-Matric Scholarship for ST Students (Centrally Sponsored)",
        originalApplicationId: "app-001",
        currentAcademicYear: "2024-2025",
        renewalAcademicYear: "2025-2026",
        renewalDeadline: "2026-10-18",
        status: "WINDOW_OPEN",
        daysRemaining: 18,
        requiredDocuments: [
          { documentType: "MARKSHEET", title: "Semester 4 & 5 Pass Marksheet", mandatory: true, description: "Official pass certificate" },
          { documentType: "BONAFIDE_CERTIFICATE", title: "3rd Year Bonafide Certificate", mandatory: true, description: "Attesting 75%+ attendance" },
          { documentType: "INCOME_CERTIFICATE", title: "Annual Self-Declaration of Income", mandatory: true, description: "Current financial status" }
        ],
        uploadedDocumentIds: ["doc-003", "doc-004"],
        marksheetUploaded: true,
        bonafideUploaded: true,
        incomeCertificateUploaded: false,
        previousYearMarksPercent: 84.5,
        createdAt: "2025-08-15T00:00:00Z",
        updatedAt: "2026-09-01T00:00:00Z"
      }
    ];

    this.opportunities = [
      {
        id: "opp-001",
        title: "National Tribal Research Fellowship 2026-27",
        type: "FELLOWSHIP",
        organization: "Ministry of Tribal Affairs",
        location: "New Delhi & Field Research Centers",
        state: "ALL",
        stSpecific: true,
        stQuotaDetails: "100% Reserved for ST Scholars",
        stipendOrBenefit: "₹38,000/month + Contingency ₹25,000/year",
        deadline: "2026-11-30",
        eligibility: "ST candidates enrolled in M.Phil / Ph.D. in any recognized Indian University",
        officialLink: "https://fellowship.tribal.gov.in",
        verificationStatus: "VERIFIED",
        description: "Prestigious national research grant supporting doctoral candidates researching tribal rights, governance, and development."
      },
      {
        id: "opp-002",
        title: "ISRO / VSSC Summer Technical Internship for Tribal Students",
        type: "INTERNSHIP",
        organization: "Indian Space Research Organisation (ISRO)",
        location: "Thiruvananthapuram, Kerala",
        state: "ALL",
        stSpecific: true,
        stQuotaDetails: "Special intake drive for Scheduled Tribe Engineering students",
        stipendOrBenefit: "₹15,000/month + Free Campus Accommodation",
        deadline: "2026-12-15",
        eligibility: "Pre-final year B.Tech/B.E. (CSE, ECE, Mechanical, Aerospace) with 70%+ marks",
        officialLink: "https://www.vssc.gov.in/internships",
        verificationStatus: "VERIFIED",
        description: "8-week intensive research internship working on satellite data analytics, embedded systems, and launch telemetry."
      },
      {
        id: "opp-003",
        title: "Digital Tribal Youth AI & Cloud Skills Accelerator",
        type: "SKILL_PROGRAM",
        organization: "National Skill Development Corporation (NSDC) & Ministry of Tribal Affairs",
        location: "Hybrid (Online + Regional District Skill Hubs)",
        state: "ALL",
        stSpecific: true,
        stQuotaDetails: "Zero-cost full scholarship for ST youth",
        stipendOrBenefit: "Free Certification Voucher + ₹3,000 Internet Allowance",
        deadline: "2026-10-31",
        eligibility: "ST students and recent graduates looking for careers in Cloud, Data, and AI development",
        officialLink: "https://nsdcindia.org/tribal-skills",
        verificationStatus: "DEMO",
        description: "Structured industry certification cohort covering Python, Cloud Architecture, and Practical AI implementations."
      },
      {
        id: "opp-004",
        title: "Free UPSC Civil Services Coaching Support for ST Aspirants",
        type: "COMPETITIVE_EXAM",
        organization: "Tribal Welfare Department & Premier Coaching Institutes",
        location: "Chennai / Hyderabad / Delhi",
        state: "ALL",
        stSpecific: true,
        stQuotaDetails: "Exclusively for ST candidates",
        stipendOrBenefit: "100% Free Coaching + ₹6,000 Monthly Living Stipend",
        deadline: "2026-11-15",
        eligibility: "Graduates aged 21-35 belonging to Scheduled Tribe communities",
        officialLink: "https://tribal.nic.in/coaching.aspx",
        verificationStatus: "VERIFIED",
        description: "10-month residential coaching program providing study materials, test series, and mentorship from senior civil servants."
      }
    ];

    this.notifications = [
      {
        id: "notif-001",
        userId: "usr-student-01",
        category: "URGENT",
        title: "Application Needs Correction: National Overseas Scholarship",
        message: "Your application #SAKSHAM-2025-TN-01449 was returned by the Nodal Institution due to an Income Certificate spelling variation. Open the Rescue Center to fix and resubmit.",
        actionUrl: "/student/rescue",
        read: false,
        createdAt: "2025-08-01T14:25:00Z"
      },
      {
        id: "notif-002",
        userId: "usr-student-01",
        category: "IMPORTANT",
        title: "Renewal Guardian Alert: 18 Days Remaining",
        message: "Renewal window for Post-Matric Scholarship is open for Academic Year 2025-2026. 1 document (Income self-declaration) is pending.",
        actionUrl: "/student/renewal",
        read: false,
        createdAt: "2026-09-25T08:00:00Z"
      },
      {
        id: "notif-003",
        userId: "usr-student-01",
        category: "INFORMATION",
        title: "New Opportunity: ISRO Summer Technical Internship for ST Students",
        message: "A new internship opportunity with stipend & free accommodation has been announced. Check eligibility now.",
        actionUrl: "/student/opportunities",
        read: true,
        createdAt: "2026-09-20T10:00:00Z"
      }
    ];

    this.aiFlags = [
      {
        id: "flag-001",
        type: "DOCUMENT_MISMATCH",
        severity: "MEDIUM",
        status: "UNDER_REVIEW",
        studentId: "usr-student-01",
        studentName: "Indhira Iyappan",
        applicationId: "app-002",
        description: "Name variation between Profile ('Indhira Iyappan') and Income Certificate ('Indhira Iyyappan'). Human verification recommended.",
        confidenceScore: 0.88,
        detectedAt: "2025-08-01T14:21:00Z"
      },
      {
        id: "flag-002",
        type: "DUPLICATE_APPLICATION",
        severity: "LOW",
        status: "RESOLVED",
        studentId: "usr-student-01",
        studentName: "Indhira Iyappan",
        applicationId: "app-003",
        description: "Multiple schemes requested in same academic cycle. Checked: Permitted under dual-scholarship exception (Central + State Top-Class).",
        confidenceScore: 0.94,
        detectedAt: "2025-08-28T16:31:00Z",
        resolvedAt: "2025-08-29T10:00:00Z",
        resolvedBy: "Tribal Welfare State Admin",
        resolutionNotes: "Allowed under distinct maintenance and institutional tuition rules."
      }
    ];

    this.auditLogs = [
      {
        id: "log-001",
        actorId: "usr-student-01",
        actorName: "Indhira Iyappan",
        actorRole: "STUDENT",
        action: "APPLICATION_SUBMITTED",
        entityType: "APPLICATION",
        entityId: "app-003",
        timestamp: "2025-08-28T16:30:00Z"
      },
      {
        id: "log-002",
        actorId: "usr-inst-01",
        actorName: "Dr. A. Ramesh (Nodal Officer)",
        actorRole: "INSTITUTION",
        action: "APPLICATION_RETURNED_FOR_CORRECTION",
        entityType: "APPLICATION",
        entityId: "app-002",
        previousState: "INSTITUTION_VERIFICATION",
        newState: "RETURNED",
        timestamp: "2025-08-01T14:20:00Z"
      },
      {
        id: "log-003",
        actorId: "usr-admin-01",
        actorName: "Tribal Welfare State Admin",
        actorRole: "ADMIN",
        action: "SCHEME_RULES_VERIFIED",
        entityType: "SCHOLARSHIP",
        entityId: "sch-001",
        timestamp: "2025-07-01T09:00:00Z"
      }
    ];
  }
}

export const store = new MemoryStore();
