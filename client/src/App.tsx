import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LowBandwidthProvider } from "./contexts/LowBandwidthContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";

import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { SakshamAiDrawer } from "./components/SakshamAiDrawer";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";

import { StudentDashboard } from "./pages/student/StudentDashboard";
import { ScholarshipDiscovery } from "./pages/student/ScholarshipDiscovery";
import { ScholarshipDetail } from "./pages/student/ScholarshipDetail";
import { EligibilityEngineView } from "./pages/student/EligibilityEngineView";
import { DocumentVault } from "./pages/student/DocumentVault";
import { ApplicationWizard } from "./pages/student/ApplicationWizard";
import { ApplicationTracking } from "./pages/student/ApplicationTracking";
import { ApplicationRescueCenter } from "./pages/student/ApplicationRescueCenter";
import { RenewalGuardian } from "./pages/student/RenewalGuardian";
import { OpportunityHub } from "./pages/student/OpportunityHub";
import { SakshamAiAssistantPage } from "./pages/student/SakshamAiAssistantPage";

import { InstitutionDashboard } from "./pages/institution/InstitutionDashboard";
import { ApplicationQueue } from "./pages/institution/ApplicationQueue";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { TribalOpportunityMap } from "./pages/admin/TribalOpportunityMap";
import { AIFlagsView } from "./pages/admin/AIFlagsView";
import { AuditLogsView } from "./pages/admin/AuditLogsView";

import { MasterDataManager } from "./pages/superadmin/MasterDataManager";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="min-h-screen flex flex-col bg-pageBg text-darkText">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex overflow-hidden">
        {!isPublicPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {!isPublicPage && <SakshamAiDrawer />}

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500">
        <p className="font-semibold text-gray-700">TRIBAL SAKSHAM AI — Smart India Hackathon SIH26239</p>
        <p className="text-[11px] mt-0.5">
          "From Scholarship Discovery to Successful Disbursement" • Ministry of Tribal Affairs
        </p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <LowBandwidthProvider>
          <AccessibilityProvider>
            <BrowserRouter>
              <AppLayout>
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Student Routes */}
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/scholarships" element={<ScholarshipDiscovery />} />
                  <Route path="/student/scholarships/:id" element={<ScholarshipDetail />} />
                  <Route path="/student/eligibility" element={<EligibilityEngineView />} />
                  <Route path="/student/vault" element={<DocumentVault />} />
                  <Route path="/student/apply" element={<ApplicationWizard />} />
                  <Route path="/student/tracking" element={<ApplicationTracking />} />
                  <Route path="/student/rescue" element={<ApplicationRescueCenter />} />
                  <Route path="/student/renewal" element={<RenewalGuardian />} />
                  <Route path="/student/opportunities" element={<OpportunityHub />} />
                  <Route path="/student/ai-assistant" element={<SakshamAiAssistantPage />} />

                  {/* Institution Routes */}
                  <Route path="/institution/dashboard" element={<InstitutionDashboard />} />
                  <Route path="/institution/queue" element={<ApplicationQueue />} />

                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/map" element={<TribalOpportunityMap />} />
                  <Route path="/admin/flags" element={<AIFlagsView />} />
                  <Route path="/admin/audit-logs" element={<AuditLogsView />} />

                  {/* Super Admin Routes */}
                  <Route path="/superadmin/master-data" element={<MasterDataManager />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </BrowserRouter>
          </AccessibilityProvider>
        </LowBandwidthProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
