import express from "express";
import { store } from "../services/store.js";
import { evaluateEligibility } from "../services/eligibilityEngine.js";
import { analyzeDocumentMismatch } from "../services/documentIntelligence.js";
import { evaluateApplicationReadiness } from "../services/preSubmissionService.js";
import { processAiChatQuery } from "../services/aiService.js";
import { logAuditEvent } from "../services/auditService.js";
import { Application, DocumentItem, UserRole } from "../types/index.js";

const router = express.Router();

// Helper middleware for mock auth in demo
function getAuthUser(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer usr-")) {
    const userId = authHeader.replace("Bearer ", "");
    return store.users.find((u) => u.id === userId) || store.users[0];
  }
  return store.users[0]; // default to demo student for seamless demo
}

// ---------------- AUTH ROUTES ----------------
router.post("/auth/login", (req, res) => {
  const { email, password, role } = req.body;
  const user = store.users.find((u) => u.email === email || (role && u.role === role));
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  logAuditEvent({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "USER_LOGIN",
    entityType: "USER",
    entityId: user.id
  });

  res.json({
    success: true,
    token: `Bearer ${user.id}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      state: user.state,
      district: user.district
    }
  });
});

router.post("/auth/demo-switch", (req, res) => {
  const { role } = req.body as { role: UserRole };
  const user = store.users.find((u) => u.role === role) || store.users[0];
  res.json({
    success: true,
    token: `Bearer ${user.id}`,
    user
  });
});

router.get("/auth/me", (req, res) => {
  const user = getAuthUser(req);
  res.json({ success: true, user });
});

// ---------------- STUDENT PROFILE ----------------
router.get("/student/profile", (req, res) => {
  const user = getAuthUser(req);
  const profile = store.studentProfiles.find((p) => p.userId === user.id) || store.studentProfiles[0];
  res.json({ success: true, profile });
});

router.put("/student/profile", (req, res) => {
  const user = getAuthUser(req);
  const idx = store.studentProfiles.findIndex((p) => p.userId === user.id);
  if (idx !== -1) {
    store.studentProfiles[idx] = {
      ...store.studentProfiles[idx],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    logAuditEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: "PROFILE_UPDATED",
      entityType: "STUDENT_PROFILE",
      entityId: store.studentProfiles[idx].id
    });
    return res.json({ success: true, profile: store.studentProfiles[idx] });
  }
  res.status(404).json({ success: false, message: "Profile not found" });
});

router.get("/student/dashboard", (req, res) => {
  const user = getAuthUser(req);
  const profile = store.studentProfiles.find((p) => p.userId === user.id) || store.studentProfiles[0];
  const userApps = store.applications.filter((a) => a.userId === user.id);
  const userDocs = store.documents.filter((d) => d.userId === user.id);
  const userRenewals = store.renewals.filter((r) => r.userId === user.id);
  const notifs = store.notifications.filter((n) => n.userId === user.id);

  const returnedApps = userApps.filter((a) => a.status === "RETURNED");
  const activeRenewals = userRenewals.filter((r) => r.status === "WINDOW_OPEN" || r.status === "UPCOMING");

  // Primary active scholarship readiness
  const primaryScholarship = store.scholarships[0];
  const readiness = evaluateApplicationReadiness(profile, primaryScholarship, userDocs);

  res.json({
    success: true,
    data: {
      profile,
      summary: {
        profileCompletion: profile.profileCompletionPercentage,
        readinessScore: readiness.readinessScore,
        activeApplicationsCount: userApps.length,
        returnedApplicationsCount: returnedApps.length,
        pendingRenewalsCount: activeRenewals.length,
        documentsCount: userDocs.length,
        notificationsCount: notifs.filter((n) => !n.read).length
      },
      readiness,
      activeApplications: userApps,
      returnedApplications: returnedApps,
      renewals: userRenewals,
      recentNotifications: notifs.slice(0, 5)
    }
  });
});

// ---------------- SCHOLARSHIPS & DISCOVERY ----------------
router.get("/scholarships", (req, res) => {
  const { state, educationLevel, type, verificationStatus, search } = req.query;
  let results = [...store.scholarships];

  if (state && state !== "ALL") {
    results = results.filter(
      (s) => s.applicableStates.includes("ALL") || s.applicableStates.includes(String(state))
    );
  }
  if (educationLevel && educationLevel !== "ALL") {
    results = results.filter(
      (s) => s.educationLevels.includes("ALL") || s.educationLevels.includes(String(educationLevel))
    );
  }
  if (type && type !== "ALL") {
    results = results.filter((s) => s.type === type);
  }
  if (verificationStatus && verificationStatus !== "ALL") {
    results = results.filter((s) => s.verificationStatus === verificationStatus);
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: results.length, data: results });
});

router.get("/scholarships/:id", (req, res) => {
  const item = store.scholarships.find((s) => s.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Scheme not found" });
  res.json({ success: true, data: item });
});

router.post("/scholarships/:id/eligibility-check", (req, res) => {
  const user = getAuthUser(req);
  const profile = store.studentProfiles.find((p) => p.userId === user.id) || store.studentProfiles[0];
  const item = store.scholarships.find((s) => s.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Scheme not found" });

  const userDocs = store.documents.filter((d) => d.userId === user.id);
  const assessment = evaluateEligibility(profile, item, userDocs.length);

  res.json({ success: true, data: assessment });
});

// ---------------- DOCUMENT VAULT ----------------
router.get("/documents", (req, res) => {
  const user = getAuthUser(req);
  const docs = store.documents.filter((d) => d.userId === user.id);
  res.json({ success: true, data: docs });
});

router.post("/documents/upload", (req, res) => {
  const user = getAuthUser(req);
  const profile = store.studentProfiles.find((p) => p.userId === user.id) || store.studentProfiles[0];
  const { documentType, title, fileName, candidateName, certificateNumber } = req.body;

  const newDoc: DocumentItem = {
    id: `doc-${Date.now()}`,
    userId: user.id,
    documentType: documentType || "OTHER",
    title: title || "Uploaded Document",
    fileName: fileName || "document.pdf",
    fileUrl: `/uploads/${fileName || "document.pdf"}`,
    fileSize: Math.floor(Math.random() * 200000) + 100000,
    mimeType: "application/pdf",
    status: "VALID",
    issueDate: new Date().toISOString().split("T")[0],
    certificateNumber: certificateNumber || `CERT-${Date.now().toString().slice(-6)}`,
    extractedMetadata: {
      candidateName: candidateName || profile.fullName,
      dob: profile.dob,
      communityReported: profile.stCommunity
    },
    uploadedAt: new Date().toISOString()
  };

  // Run mismatch detection
  const mismatchFlags = analyzeDocumentMismatch(profile, newDoc);
  if (mismatchFlags.length > 0) {
    newDoc.mismatchFlags = mismatchFlags;
    newDoc.status = "REQUIRES_REVIEW";
  }

  store.documents.push(newDoc);

  logAuditEvent({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "DOCUMENT_UPLOADED",
    entityType: "DOCUMENT",
    entityId: newDoc.id
  });

  res.json({ success: true, data: newDoc });
});

router.delete("/documents/:id", (req, res) => {
  const user = getAuthUser(req);
  const idx = store.documents.findIndex((d) => d.id === req.params.id && d.userId === user.id);
  if (idx !== -1) {
    const deleted = store.documents.splice(idx, 1)[0];
    return res.json({ success: true, message: "Document deleted", data: deleted });
  }
  res.status(404).json({ success: false, message: "Document not found" });
});
// ---------------- APPLICATIONS & APPLICATION WIZARD ----------------
router.get("/applications", (req, res) => {
  const user = getAuthUser(req);
  if (user.role === "STUDENT") {
    const apps = store.applications.filter((a) => a.userId === user.id);
    return res.json({ success: true, data: apps });
  }
  res.json({ success: true, data: store.applications });
});

router.get("/applications/:id", (req, res) => {
  const app = store.applications.find((a) => a.id === req.params.id);
  if (!app) return res.status(404).json({ success: false, message: "Application not found" });
  res.json({ success: true, data: app });
});

router.post("/applications", (req, res) => {
  const user = getAuthUser(req);
  const profile = store.studentProfiles.find((p) => p.userId === user.id) || store.studentProfiles[0];
  const { scholarshipId, academicYear } = req.body;
  const sch = store.scholarships.find((s) => s.id === scholarshipId) || store.scholarships[0];

  const userDocs = store.documents.filter((d) => d.userId === user.id);
  const readiness = evaluateApplicationReadiness(profile, sch, userDocs);

  const newApp: Application = {
    id: `app-${Date.now()}`,
    applicationNumber: `SAKSHAM-2026-${profile.state.substring(0, 2).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`,
    userId: user.id,
    scholarshipId: sch.id,
    scholarshipName: sch.name,
    academicYear: academicYear || "2025-2026",
    status: "DRAFT",
    statusHistory: [
      {
        stage: "DRAFT",
        timestamp: new Date().toISOString(),
        actorRole: user.role,
        actorName: user.name,
        comments: "Application draft initialized"
      }
    ],
    personalDetails: {
      fullName: profile.fullName,
      gender: profile.gender,
      dob: profile.dob,
      mobile: profile.mobile,
      email: profile.email,
      state: profile.state,
      district: profile.district,
      tribalRegion: profile.tribalRegion,
      stCommunity: profile.stCommunity
    },
    educationDetails: {
      educationLevel: profile.educationLevel,
      course: profile.course,
      stream: profile.stream,
      yearOfStudy: profile.yearOfStudy,
      institutionName: profile.institutionName,
      institutionType: profile.institutionType,
      gpaOrPercentage: profile.gpaOrPercentage
    },
    eligibilityDeclaration: {
      stConfirmed: true,
      annualIncomeConfirmed: profile.annualFamilyIncome
    },
    uploadedDocumentIds: userDocs.map((d) => d.id),
    bankDetails: {
      accountHolderName: profile.fullName,
      accountNumber: profile.bankAccountNumber || "50100456789123",
      ifscCode: profile.bankIfsc || "SBIN0001234",
      bankName: profile.bankName || "State Bank of India",
      branchName: "Main Branch",
      aadhaarLinked: true
    },
    readinessScore: readiness.readinessScore,
    readinessBreakdown: readiness.breakdown,
    preSubmissionFlags: readiness.flags,
    lastUpdatedAt: new Date().toISOString()
  };

  store.applications.push(newApp);

  logAuditEvent({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "APPLICATION_DRAFT_CREATED",
    entityType: "APPLICATION",
    entityId: newApp.id
  });

  res.json({ success: true, data: newApp });
});

router.put("/applications/:id", (req, res) => {
  const user = getAuthUser(req);
  const idx = store.applications.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Application not found" });

  store.applications[idx] = {
    ...store.applications[idx],
    ...req.body,
    lastUpdatedAt: new Date().toISOString()
  };

  res.json({ success: true, data: store.applications[idx] });
});

router.post("/applications/:id/submit", (req, res) => {
  const user = getAuthUser(req);
  const idx = store.applications.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Application not found" });

  const app = store.applications[idx];
  const profile = store.studentProfiles.find((p) => p.userId === app.userId) || store.studentProfiles[0];
  const sch = store.scholarships.find((s) => s.id === app.scholarshipId) || store.scholarships[0];
  const userDocs = store.documents.filter((d) => d.userId === app.userId);

  const readiness = evaluateApplicationReadiness(profile, sch, userDocs, app);

  if (!readiness.readyToSubmit) {
    return res.status(400).json({
      success: false,
      message: "Application is not ready for submission. Please resolve critical blocking errors.",
      readiness
    });
  }

  app.status = "INSTITUTION_VERIFICATION";
  app.submittedAt = new Date().toISOString();
  app.lastUpdatedAt = new Date().toISOString();
  app.statusHistory.push({
    stage: "SUBMITTED",
    timestamp: new Date().toISOString(),
    actorRole: user.role,
    actorName: user.name,
    comments: "Application submitted with verified attachments"
  });
  app.statusHistory.push({
    stage: "INSTITUTION_VERIFICATION",
    timestamp: new Date().toISOString(),
    actorRole: user.role,
    actorName: user.name,
    comments: "Routed to Institution Verification queue"
  });

  logAuditEvent({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "APPLICATION_SUBMITTED",
    entityType: "APPLICATION",
    entityId: app.id
  });

  res.json({ success: true, message: "Application submitted successfully!", data: app });
});

// ---------------- APPLICATION RESCUE CENTER (FIX & RESUBMIT) ----------------
router.post("/applications/:id/resubmit", (req, res) => {
  const user = getAuthUser(req);
  const idx = store.applications.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Application not found" });

  const app = store.applications[idx];
  const { updatedNote, replacementDocId } = req.body;

  if (replacementDocId && !app.uploadedDocumentIds.includes(replacementDocId)) {
    app.uploadedDocumentIds.push(replacementDocId);
  }

  app.status = "INSTITUTION_VERIFICATION";
  app.lastUpdatedAt = new Date().toISOString();
  if (!app.correctionHistory) app.correctionHistory = [];
  app.correctionHistory.push({
    returnedAt: app.statusHistory.find((s) => s.stage === "RETURNED")?.timestamp || new Date().toISOString(),
    reason: app.returnedReason || "Document verification update",
    fixedAt: new Date().toISOString(),
    actionTaken: updatedNote || "Uploaded updated endorsed certificate via Rescue Center"
  });

  app.statusHistory.push({
    stage: "INSTITUTION_VERIFICATION",
    timestamp: new Date().toISOString(),
    actorRole: user.role,
    actorName: user.name,
    comments: `Application Resubmitted via Rescue Center: ${updatedNote || "Corrections rectified"}`
  });

  logAuditEvent({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "APPLICATION_RESCUED_RESUBMITTED",
    entityType: "APPLICATION",
    entityId: app.id,
    previousState: "RETURNED",
    newState: "INSTITUTION_VERIFICATION"
  });

  res.json({
    success: true,
    message: "Application rescued and resubmitted to Institution Nodal Officer queue!",
    data: app
  });
});

// ---------------- RENEWAL GUARDIAN ----------------
router.get("/renewals", (req, res) => {
  const user = getAuthUser(req);
  const list = store.renewals.filter((r) => r.userId === user.id);
  res.json({ success: true, data: list });
});

router.post("/renewals/:id/submit", (req, res) => {
  const user = getAuthUser(req);
  const idx = store.renewals.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Renewal record not found" });

  store.renewals[idx].status = "SUBMITTED";
  store.renewals[idx].updatedAt = new Date().toISOString();

  logAuditEvent({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "RENEWAL_SUBMITTED",
    entityType: "RENEWAL",
    entityId: store.renewals[idx].id
  });

  res.json({ success: true, message: "Renewal submitted successfully!", data: store.renewals[idx] });
});

// ---------------- OPPORTUNITY HUB ----------------
router.get("/opportunities", (req, res) => {
  const { type, state } = req.query;
  let list = [...store.opportunities];
  if (type && type !== "ALL") list = list.filter((o) => o.type === type);
  if (state && state !== "ALL") list = list.filter((o) => o.state === "ALL" || o.state === state);
  res.json({ success: true, count: list.length, data: list });
});

// ---------------- AI ASSISTANT ----------------
router.post("/ai/chat", async (req, res) => {
  const user = getAuthUser(req);
  const { message, language } = req.body;
  const result = await processAiChatQuery(message || "", user.id, language || "en");
  res.json({ success: true, ...result });
});

// ---------------- INSTITUTION PORTAL ----------------
router.get("/institution/dashboard", (req, res) => {
  const pending = store.applications.filter((a) => a.status === "INSTITUTION_VERIFICATION");
  const recommended = store.applications.filter((a) => a.status === "INSTITUTION_RECOMMENDED");
  const returned = store.applications.filter((a) => a.status === "RETURNED");

  res.json({
    success: true,
    data: {
      pendingCount: pending.length,
      recommendedCount: recommended.length,
      returnedCount: returned.length,
      totalQueue: store.applications.length,
      pendingApplications: pending
    }
  });
});

router.get("/institution/applications", (req, res) => {
  const { status } = req.query;
  let apps = [...store.applications];
  if (status) apps = apps.filter((a) => a.status === status);
  res.json({ success: true, data: apps });
});

router.post("/institution/applications/:id/action", (req, res) => {
  const user = getAuthUser(req);
  const { action, remarks, returnReason, requiredDocs } = req.body;
  const idx = store.applications.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Application not found" });

  const app = store.applications[idx];
  const prevStage = app.status;

  if (action === "RECOMMEND") {
    app.status = "INSTITUTION_RECOMMENDED";
    app.institutionVerification = {
      verifiedBy: user.name,
      verifiedAt: new Date().toISOString(),
      academicStatusConfirmed: true,
      stStatusConfirmed: true,
      bonafideConfirmed: true,
      action: "RECOMMENDED",
      remarks: remarks || "Academic and category credentials verified from college registry."
    };
    app.statusHistory.push({
      stage: "INSTITUTION_RECOMMENDED",
      timestamp: new Date().toISOString(),
      actorRole: "INSTITUTION",
      actorName: user.name,
      comments: remarks || "Recommended for State Department Approval"
    });
  } else if (action === "REQUEST_CORRECTION") {
    app.status = "RETURNED";
    app.returnedReason = returnReason || remarks || "Document clarification required";
    app.requiredCorrectionDocs = requiredDocs || ["INCOME_CERTIFICATE"];
    app.correctionInstructions = [
      "Review the highlighted observation from the Institution Nodal Officer.",
      "Re-upload the clear / endorsed copy in your Document Vault.",
      "Click 'Fix & Resubmit' in the Application Rescue Center."
    ];
    app.correctionDeadline = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    app.statusHistory.push({
      stage: "RETURNED",
      timestamp: new Date().toISOString(),
      actorRole: "INSTITUTION",
      actorName: user.name,
      comments: remarks || returnReason
    });
  }

  app.lastUpdatedAt = new Date().toISOString();

  logAuditEvent({
    actorId: user.id,
    actorName: user.name,
    actorRole: "INSTITUTION",
    action: `INSTITUTION_ACTION_${action}`,
    entityType: "APPLICATION",
    entityId: app.id,
    previousState: prevStage,
    newState: app.status
  });

  res.json({ success: true, message: `Application updated to ${app.status}`, data: app });
});

// ---------------- ADMIN ANALYTICS & DASHBOARD ----------------
router.get("/admin/analytics", (req, res) => {
  const totalStudents = store.studentProfiles.length + 340; // demo aggregate
  const totalApps = store.applications.length + 510;
  const approvedApps = store.applications.filter((a) => a.status === "APPROVED" || a.status === "DISBURSED").length + 380;
  const returnedApps = store.applications.filter((a) => a.status === "RETURNED").length + 42;
  const pendingApps = totalApps - approvedApps - returnedApps;

  const stateDistribution = [
    { state: "Odisha", applications: 185, sanctioned: 142 },
    { state: "Jharkhand", applications: 160, sanctioned: 125 },
    { state: "Madhya Pradesh", applications: 140, sanctioned: 110 },
    { state: "Chhattisgarh", applications: 115, sanctioned: 92 },
    { state: "Tamil Nadu", applications: 95, sanctioned: 81 },
    { state: "Maharashtra", applications: 80, sanctioned: 68 },
    { state: "Kerala", applications: 45, sanctioned: 38 }
  ];

  const monthlyTrends = [
    { month: "Apr", applications: 45, disbursements: 30 },
    { month: "May", applications: 85, disbursements: 62 },
    { month: "Jun", applications: 130, disbursements: 95 },
    { month: "Jul", applications: 210, disbursements: 155 },
    { month: "Aug", applications: 290, disbursements: 220 },
    { month: "Sep", applications: 350, disbursements: 285 }
  ];

  const documentFailurePatterns = [
    { reason: "Income Certificate Spelling / Expiry", percentage: 44 },
    { reason: "Bonafide Missing Head Seal", percentage: 26 },
    { reason: "Bank Account Not Aadhaar Linked", percentage: 18 },
    { reason: "Community Certificate Unreadable", percentage: 12 }
  ];

  res.json({
    success: true,
    data: {
      isDemoData: true,
      disclaimer: "Sample Dataset for Hackathon Prototype Demonstration",
      kpis: {
        totalStudents,
        totalApplications: totalApps,
        pendingApplications: pendingApps,
        approvedApplications: approvedApps,
        returnedApplications: returnedApps,
        activeScholarships: store.scholarships.length,
        aiFlagsCount: store.aiFlags.length
      },
      stateDistribution,
      monthlyTrends,
      documentFailurePatterns
    }
  });
});

router.get("/admin/ai-flags", (req, res) => {
  res.json({ success: true, data: store.aiFlags });
});

router.post("/admin/ai-flags/:id/resolve", (req, res) => {
  const user = getAuthUser(req);
  const idx = store.aiFlags.findIndex((f) => f.id === req.params.id);
  if (idx !== -1) {
    store.aiFlags[idx].status = "RESOLVED";
    store.aiFlags[idx].resolvedAt = new Date().toISOString();
    store.aiFlags[idx].resolvedBy = user.name;
    return res.json({ success: true, data: store.aiFlags[idx] });
  }
  res.status(404).json({ success: false, message: "Flag not found" });
});

router.get("/admin/audit-logs", (req, res) => {
  res.json({ success: true, data: store.auditLogs });
});

// ---------------- SUPER ADMIN MASTER DATA MANAGER ----------------
router.post("/superadmin/states", (req, res) => {
  const { code, name, tribalPopPercentage } = req.body;
  if (!code || !name) return res.status(400).json({ success: false, message: "Code and name required" });
  store.states.push({ code, name, tribalPopPercentage: Number(tribalPopPercentage) || 0 });
  res.json({ success: true, message: `State ${name} added to master data!`, data: store.states });
});

router.post("/superadmin/districts", (req, res) => {
  const { stateCode, name, isTribalRegion, majorTribes } = req.body;
  if (!stateCode || !name) return res.status(400).json({ success: false, message: "StateCode and name required" });
  store.districts.push({
    stateCode,
    name,
    isTribalRegion: Boolean(isTribalRegion),
    majorTribes: Array.isArray(majorTribes) ? majorTribes : [majorTribes || "Tribal Community"]
  });
  res.json({ success: true, message: `District ${name} added to master data!`, data: store.districts });
});

router.post("/superadmin/scholarships", (req, res) => {
  const newSch = {
    ...req.body,
    id: `sch-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.scholarships.push(newSch);
  res.json({ success: true, message: "New scheme configured dynamically without code changes!", data: newSch });
});

// ---------------- MASTER DATA & NOTIFICATIONS ----------------
router.get("/master-data/states", (req, res) => {
  res.json({ success: true, data: store.states });
});

router.get("/master-data/districts", (req, res) => {
  const { stateCode } = req.query;
  let list = store.districts;
  if (stateCode) list = list.filter((d) => d.stateCode === stateCode);
  res.json({ success: true, data: list });
});

router.get("/notifications", (req, res) => {
  const user = getAuthUser(req);
  const list = store.notifications.filter((n) => n.userId === user.id);
  res.json({ success: true, data: list });
});

router.post("/notifications/:id/read", (req, res) => {
  const idx = store.notifications.findIndex((n) => n.id === req.params.id);
  if (idx !== -1) {
    store.notifications[idx].read = true;
    return res.json({ success: true, data: store.notifications[idx] });
  }
  res.status(404).json({ success: false, message: "Notification not found" });
});

router.post("/notifications/mark-all-read", (req, res) => {
  const user = getAuthUser(req);
  store.notifications.forEach((n) => {
    if (n.userId === user.id) n.read = true;
  });
  res.json({ success: true, message: "All notifications marked as read" });
});

export default router;
