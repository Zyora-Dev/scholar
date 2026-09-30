const API_BASE = "/api";

function getHeaders() {
  const token = localStorage.getItem("saksham_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {})
  };
}

export const api = {
  // Auth
  login: (email: string, role?: string) =>
    fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role })
    }).then((r) => r.json()),

  demoSwitch: (role: string) =>
    fetch(`${API_BASE}/auth/demo-switch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    }).then((r) => r.json()),

  // Student
  getProfile: () => fetch(`${API_BASE}/student/profile`, { headers: getHeaders() }).then((r) => r.json()),
  updateProfile: (profileData: any) =>
    fetch(`${API_BASE}/student/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    }).then((r) => r.json()),

  getStudentDashboard: () =>
    fetch(`${API_BASE}/student/dashboard`, { headers: getHeaders() }).then((r) => r.json()),

  // Scholarships
  getScholarships: (params?: { state?: string; educationLevel?: string; type?: string; verificationStatus?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.state) q.append("state", params.state);
    if (params?.educationLevel) q.append("educationLevel", params.educationLevel);
    if (params?.type) q.append("type", params.type);
    if (params?.verificationStatus) q.append("verificationStatus", params.verificationStatus);
    if (params?.search) q.append("search", params.search);
    return fetch(`${API_BASE}/scholarships?${q.toString()}`, { headers: getHeaders() }).then((r) => r.json());
  },

  getScholarshipById: (id: string) =>
    fetch(`${API_BASE}/scholarships/${id}`, { headers: getHeaders() }).then((r) => r.json()),

  checkEligibility: (scholarshipId: string) =>
    fetch(`${API_BASE}/scholarships/${scholarshipId}/eligibility-check`, {
      method: "POST",
      headers: getHeaders()
    }).then((r) => r.json()),

  // Documents
  getDocuments: () => fetch(`${API_BASE}/documents`, { headers: getHeaders() }).then((r) => r.json()),
  uploadDocument: (data: { documentType: string; title: string; fileName: string; candidateName?: string }) =>
    fetch(`${API_BASE}/documents/upload`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then((r) => r.json()),
  deleteDocument: (id: string) =>
    fetch(`${API_BASE}/documents/${id}`, { method: "DELETE", headers: getHeaders() }).then((r) => r.json()),

  // Applications
  getApplications: () => fetch(`${API_BASE}/applications`, { headers: getHeaders() }).then((r) => r.json()),
  getApplicationById: (id: string) =>
    fetch(`${API_BASE}/applications/${id}`, { headers: getHeaders() }).then((r) => r.json()),
  createApplicationDraft: (scholarshipId: string, academicYear?: string) =>
    fetch(`${API_BASE}/applications`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ scholarshipId, academicYear })
    }).then((r) => r.json()),
  updateApplicationDraft: (id: string, data: any) =>
    fetch(`${API_BASE}/applications/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then((r) => r.json()),
  submitApplication: (id: string) =>
    fetch(`${API_BASE}/applications/${id}/submit`, {
      method: "POST",
      headers: getHeaders()
    }).then((r) => r.json()),

  // Rescue Center Fix & Resubmit
  resubmitApplication: (id: string, updatedNote?: string, replacementDocId?: string) =>
    fetch(`${API_BASE}/applications/${id}/resubmit`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ updatedNote, replacementDocId })
    }).then((r) => r.json()),

  // Renewals
  getRenewals: () => fetch(`${API_BASE}/renewals`, { headers: getHeaders() }).then((r) => r.json()),
  submitRenewal: (id: string) =>
    fetch(`${API_BASE}/renewals/${id}/submit`, { method: "POST", headers: getHeaders() }).then((r) => r.json()),

  // Opportunities
  getOpportunities: (type?: string, state?: string) => {
    const q = new URLSearchParams();
    if (type) q.append("type", type);
    if (state) q.append("state", state);
    return fetch(`${API_BASE}/opportunities?${q.toString()}`, { headers: getHeaders() }).then((r) => r.json());
  },

  // AI
  aiChat: (message: string, language?: string) =>
    fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ message, language })
    }).then((r) => r.json()),

  // Institution
  getInstitutionDashboard: () =>
    fetch(`${API_BASE}/institution/dashboard`, { headers: getHeaders() }).then((r) => r.json()),
  getInstitutionApplications: (status?: string) => {
    const q = status ? `?status=${status}` : "";
    return fetch(`${API_BASE}/institution/applications${q}`, { headers: getHeaders() }).then((r) => r.json());
  },
  institutionAction: (id: string, action: "RECOMMEND" | "REQUEST_CORRECTION" | "REJECT", remarks: string, returnReason?: string, requiredDocs?: string[]) =>
    fetch(`${API_BASE}/institution/applications/${id}/action`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ action, remarks, returnReason, requiredDocs })
    }).then((r) => r.json()),

  // Admin
  getAdminAnalytics: () => fetch(`${API_BASE}/admin/analytics`, { headers: getHeaders() }).then((r) => r.json()),
  getAiFlags: () => fetch(`${API_BASE}/admin/ai-flags`, { headers: getHeaders() }).then((r) => r.json()),
  resolveFlag: (id: string) =>
    fetch(`${API_BASE}/admin/ai-flags/${id}/resolve`, { method: "POST", headers: getHeaders() }).then((r) => r.json()),
  getAuditLogs: () => fetch(`${API_BASE}/admin/audit-logs`, { headers: getHeaders() }).then((r) => r.json()),

  // Super Admin
  addState: (data: { code: string; name: string; tribalPopPercentage: number }) =>
    fetch(`${API_BASE}/superadmin/states`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then((r) => r.json()),
  addDistrict: (data: { stateCode: string; name: string; isTribalRegion: boolean; majorTribes: string[] }) =>
    fetch(`${API_BASE}/superadmin/districts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then((r) => r.json()),
  addScholarship: (data: any) =>
    fetch(`${API_BASE}/superadmin/scholarships`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then((r) => r.json()),

  // Master Data & Notifications
  getStates: () => fetch(`${API_BASE}/master-data/states`, { headers: getHeaders() }).then((r) => r.json()),
  getDistricts: (stateCode?: string) => {
    const q = stateCode ? `?stateCode=${stateCode}` : "";
    return fetch(`${API_BASE}/master-data/districts${q}`, { headers: getHeaders() }).then((r) => r.json());
  },
  getNotifications: () => fetch(`${API_BASE}/notifications`, { headers: getHeaders() }).then((r) => r.json()),
  markNotificationRead: (id: string) =>
    fetch(`${API_BASE}/notifications/${id}/read`, { method: "POST", headers: getHeaders() }).then((r) => r.json()),
  markAllNotificationsRead: () =>
    fetch(`${API_BASE}/notifications/mark-all-read`, { method: "POST", headers: getHeaders() }).then((r) => r.json())
};
