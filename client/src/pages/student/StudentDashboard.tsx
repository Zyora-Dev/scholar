import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  FolderLock,
  ChevronRight
} from "lucide-react";
import { api } from "../../services/api";
import { ApplicationStatusBadge, VerificationBadge, MatchScoreBadge } from "../../components/Badges";
import { useLanguage } from "../../contexts/LanguageContext";

export const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getStudentDashboard()
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Loading student scholarship dashboard...</p>
        </div>
      </div>
    );
  }

  const profile = data?.profile;
  const summary = data?.summary;
  const returnedApps = data?.returnedApplications || [];
  const renewals = data?.renewals || [];
  const activeApps = data?.activeApplications || [];

  return (
    <div className="space-y-6">
      {/* 1. Header Welcome & Domicile Banner */}
      <div className="bg-gradient-to-r from-saffron/10 via-white to-tribal/10 p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-tribal text-white">
              Scheduled Tribe Student
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Community: <strong className="text-gray-900">{profile?.stCommunity || "Irula"}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
            Vanakkam, {profile?.fullName || "Student"}!
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            {profile?.course} • {profile?.institutionName} ({profile?.district}, {profile?.state})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/student/scholarships"
            className="px-4 py-2.5 bg-saffron text-white rounded-lg text-xs font-bold hover:bg-saffron-dark shadow-sm flex items-center gap-1.5 transition-all"
          >
            Find Scholarships <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/student/vault"
            className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 flex items-center gap-1.5"
          >
            <FolderLock className="w-4 h-4 text-tribal" /> Document Vault
          </Link>
        </div>
      </div>

      {/* 2. Critical Action Alerts (Rescue Center & Renewal Guardian) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RESCUE ALERT CARD */}
        {returnedApps.length > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-white border-2 border-rose-300 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white">
                  <AlertTriangle className="w-3.5 h-3.5" /> APPLICATION RESCUE REQUIRED
                </span>
                <span className="text-xs text-gray-400">Queue Priority Protected</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mt-2.5">
                {returnedApps[0].scholarshipName}
              </h3>
              <p className="text-xs text-rose-800 mt-1 font-medium bg-rose-100/60 p-2.5 rounded-lg border border-rose-200">
                <strong>Nodal Officer Note:</strong> {returnedApps[0].returnedReason}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Deadline: <strong>{returnedApps[0].correctionDeadline || "2026-10-25"}</strong>
              </span>
              <button
                onClick={() => navigate("/student/rescue")}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                Open Rescue Center <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* RENEWAL GUARDIAN ALERT CARD */}
        {renewals.length > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border-2 border-amber-300 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-white">
                  <RefreshCw className="w-3.5 h-3.5" /> RENEWAL IN {renewals[0].daysRemaining} DAYS
                </span>
                <span className="text-xs text-gray-500 font-semibold">AY {renewals[0].renewalAcademicYear}</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mt-2.5">
                {renewals[0].scholarshipName}
              </h3>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-center">
                <div className="p-1.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  ✓ Marksheet
                </div>
                <div className="p-1.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  ✓ Bonafide
                </div>
                <div className="p-1.5 rounded bg-rose-100 text-rose-800 font-semibold">
                  ⚠ Income Decl.
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Window Closes: <strong>{renewals[0].renewalDeadline}</strong>
              </span>
              <button
                onClick={() => navigate("/student/renewal")}
                className="px-4 py-2 bg-tribal hover:bg-tribal-dark text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                Start Renewal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Journey Stepper */}
      <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="font-extrabold text-sm text-gray-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-saffron" /> YOUR SCHOLARSHIP SUCCESS JOURNEY
          </h2>
          <span className="text-xs text-gray-500">Step 4 of 6 Active</span>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-gray-900">1. Profile</span>
            <span className="text-[10px] text-emerald-700 font-semibold">92% Complete</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-gray-900">2. Eligibility</span>
            <span className="text-[10px] text-emerald-700 font-semibold">Pre-Assessed</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex flex-col items-center text-center">
            <AlertTriangle className="w-5 h-5 text-amber-600 mb-1" />
            <span className="text-xs font-bold text-gray-900">3. Documents</span>
            <span className="text-[10px] text-amber-700 font-bold">1 Review Flag</span>
          </div>

          <div className="p-3 rounded-xl bg-saffron/10 border-2 border-saffron flex flex-col items-center text-center">
            <Clock className="w-5 h-5 text-saffron mb-1" />
            <span className="text-xs font-bold text-saffron">4. Applications</span>
            <span className="text-[10px] text-saffron-dark font-extrabold">Active (3)</span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center text-center">
            <Clock className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-xs font-bold text-gray-700">5. Verification</span>
            <span className="text-[10px] text-gray-500">In Progress</span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center text-center">
            <RefreshCw className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-xs font-bold text-gray-700">6. Renewal</span>
            <span className="text-[10px] text-gray-500">Approaching</span>
          </div>
        </div>
      </div>

      {/* 4. Readiness & Document Intelligence Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Readiness Score Gauge */}
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Application Readiness</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              High
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-4xl font-extrabold text-gray-900">
              {summary?.readinessScore || 97}%
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                READY TO SUBMIT
              </span>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="mt-5 space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Profile Completeness</span>
                <span className="font-bold">100%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Document Vault Coverage</span>
                <span className="font-bold">90%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-[90%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Eligibility Factors</span>
                <span className="font-bold">95%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-[95%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>DBT Bank Account Readiness</span>
                <span className="font-bold">100% (Aadhaar Seeded)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Applications Table */}
        <div className="lg:col-span-2 bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">Your Active Applications</h3>
              <Link
                to="/student/tracking"
                className="text-xs font-bold text-saffron hover:underline flex items-center gap-1"
              >
                View Full Tracking <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-3 divide-y divide-gray-100">
              {activeApps.map((app: any) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold text-gray-900">{app.scholarshipName}</p>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      #{app.applicationNumber} • AY {app.academicYear}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApplicationStatusBadge status={app.status} />
                    <button
                      onClick={() =>
                        app.status === "RETURNED"
                          ? navigate("/student/rescue")
                          : navigate(`/student/tracking`)
                      }
                      className="text-xs px-2.5 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold"
                    >
                      {app.status === "RETURNED" ? "Fix Now" : "Track"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Direct Benefit Transfer (DBT) enabled via PFMS</span>
            <Link to="/student/apply" className="text-saffron font-bold hover:underline">
              + Start New Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
