import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  IndianRupee,
  RefreshCw
} from "lucide-react";
import { api } from "../../services/api";
import { ApplicationStatusBadge } from "../../components/Badges";
import { Application, ApplicationStatus } from "../../types";

export const ApplicationTracking: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getApplications().then((res) => {
      if (res.success && res.data.length > 0) {
        setApplications(res.data);
        setSelectedAppId(res.data[0].id);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Loading Application Tracking...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="bg-surface p-12 rounded-2xl border border-gray-200 text-center max-w-md mx-auto">
        <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-bold text-gray-800 text-sm">No applications submitted yet</h3>
        <p className="text-xs text-gray-500 mt-1">Discover scholarships and submit via the Smart Wizard.</p>
        <Link
          to="/student/scholarships"
          className="mt-4 inline-block px-4 py-2 bg-saffron text-white rounded-lg text-xs font-bold"
        >
          Explore Scholarships
        </Link>
      </div>
    );
  }

  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  const stages: { stage: ApplicationStatus; label: string; desc: string }[] = [
    { stage: "DRAFT", label: "Draft Initialized", desc: "Application prepared by student" },
    { stage: "SUBMITTED", label: "Submitted", desc: "Sent to college scrutiny authority" },
    { stage: "INSTITUTION_VERIFICATION", label: "Institution Scrutiny", desc: "Principal / Nodal Officer verification" },
    { stage: "INSTITUTION_RECOMMENDED", label: "Recommended", desc: "Forwarded to State Welfare Department" },
    { stage: "DEPARTMENT_REVIEW", label: "Department Scrutiny", desc: "Directorate sanction order processing" },
    { stage: "APPROVED", label: "Sanction Approved", desc: "Direct Benefit Transfer sanctioned" },
    { stage: "DISBURSED", label: "Disbursed via PFMS", desc: "Amount credited to bank account" },
    { stage: "RENEWAL", label: "Renewal Cycle", desc: "Window for next academic year" }
  ];

  const getStageState = (stageKey: ApplicationStatus) => {
    if (app.status === "RETURNED" && stageKey === "INSTITUTION_VERIFICATION") return "returned";
    const historyStages = app.statusHistory.map((h) => h.stage);
    if (historyStages.includes(stageKey)) return "completed";
    if (app.status === stageKey) return "current";
    return "pending";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-tribal/10 text-tribal">
            Real-Time Stage Monitor
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">Application Tracking Lifecycle</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparent tracking from student submission, through college nodal scrutiny, state sanction, to PFMS DBT disbursement.
          </p>
        </div>

        {/* Application Selector */}
        <div className="w-full md:w-72">
          <label className="block text-[11px] font-bold text-gray-700 mb-1">Select Application to Track:</label>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                #{a.applicationNumber} ({a.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Return Warning Banner if applicable */}
      {app.status === "RETURNED" && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0" />
            <div>
              <strong className="text-xs font-bold text-rose-900 block">
                This application requires clarification / correction
              </strong>
              <p className="text-xs text-rose-800">{app.returnedReason}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/student/rescue")}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg whitespace-nowrap shadow-sm"
          >
            Open Rescue Center & Fix
          </button>
        </div>
      )}

      {/* Main Details and Stepper Card */}
      <div className="bg-surface rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs">
          <div>
            <span className="text-gray-400 text-[11px] block">Application No:</span>
            <strong className="font-mono text-gray-900">{app.applicationNumber}</strong>
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Current Status:</span>
            <ApplicationStatusBadge status={app.status} />
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Academic Year:</span>
            <strong className="text-gray-900">{app.academicYear}</strong>
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Pending With:</span>
            <strong className="text-gray-900">
              {app.status === "INSTITUTION_VERIFICATION"
                ? "College Nodal Officer"
                : app.status === "DEPARTMENT_REVIEW"
                ? "State Welfare Director"
                : app.status === "DISBURSED"
                ? "Direct Benefit Bank (PFMS)"
                : "Student Action"}
            </strong>
          </div>
        </div>

        {/* Visual Lifecycle Stepper */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-6">Application Lifecycle Progression</h3>
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {stages.map((st, idx) => {
              const state = getStageState(st.stage);
              return (
                <div key={idx} className="relative flex items-start gap-4 text-xs">
                  {/* Status Indicator Icon */}
                  <div
                    className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center ${
                      state === "completed"
                        ? "bg-emerald-600 text-white"
                        : state === "returned"
                        ? "bg-rose-600 text-white animate-pulse"
                        : state === "current"
                        ? "bg-saffron text-white ring-4 ring-saffron/20"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {state === "completed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : state === "returned" ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Stage Details */}
                  <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <strong
                        className={`text-xs font-bold ${
                          state === "completed"
                            ? "text-emerald-900"
                            : state === "returned"
                            ? "text-rose-900"
                            : state === "current"
                            ? "text-saffron-dark font-extrabold"
                            : "text-gray-500"
                        }`}
                      >
                        {st.label}
                      </strong>
                      {state === "completed" && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Completed
                        </span>
                      )}
                      {state === "current" && (
                        <span className="text-[10px] font-semibold text-saffron bg-saffron/10 px-2 py-0.5 rounded">
                          Current Stage
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit History Timeline */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold text-xs text-gray-700 mb-3">Official Action Log & Comments:</h4>
          <div className="space-y-2">
            {app.statusHistory.map((hist, hIdx) => (
              <div key={hIdx} className="p-2.5 rounded-lg bg-gray-50 text-[11px] flex items-start justify-between">
                <div>
                  <span className="font-bold text-gray-900 mr-2">{hist.stage}</span>
                  <span className="text-gray-500">by {hist.actorName} ({hist.actorRole})</span>
                  {hist.comments && (
                    <p className="text-gray-700 mt-0.5 italic">"{hist.comments}"</p>
                  )}
                </div>
                <span className="text-gray-400 text-[10px] whitespace-nowrap ml-2">
                  {new Date(hist.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
