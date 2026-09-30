import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LifeBuoy,
  AlertTriangle,
  CheckCircle2,
  Upload,
  ArrowRight,
  Clock,
  ShieldCheck,
  FileText,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { api } from "../../services/api";
import { Application, DocumentItem } from "../../types";

export const ApplicationRescueCenter: React.FC = () => {
  const [returnedApps, setReturnedApps] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [correctionNote, setCorrectionNote] = useState("Updated endorsed certificate attached as requested by Nodal Officer.");
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [resubmitting, setResubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getApplications(), api.getDocuments()]).then(([appsRes, docsRes]) => {
      if (appsRes.success) {
        const returned = appsRes.data.filter((a: any) => a.status === "RETURNED");
        setReturnedApps(returned);
        if (returned.length > 0) setSelectedApp(returned[0]);
      }
      if (docsRes.success) {
        setDocuments(docsRes.data);
        if (docsRes.data.length > 0) setSelectedDocId(docsRes.data[0].id);
      }
      setLoading(false);
    });
  }, []);

  const handleFixAndResubmit = async () => {
    if (!selectedApp) return;
    setResubmitting(true);
    try {
      const res = await api.resubmitApplication(selectedApp.id, correctionNote, selectedDocId);
      if (res.success) {
        alert("Application successfully rescued! Returned to Nodal Officer with retained queue priority.");
        navigate("/student/tracking");
      }
    } catch (e) {
      alert("Error resubmitting application. Please try again.");
    } finally {
      setResubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Loading Application Rescue Center...</div>;
  }

  if (returnedApps.length === 0) {
    return (
      <div className="bg-surface p-12 rounded-2xl border border-gray-200 text-center max-w-xl mx-auto space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h2 className="text-base font-extrabold text-gray-900">Zero Applications Need Correction</h2>
        <p className="text-xs text-gray-600">
          All your scholarship applications are either submitted, recommended, or successfully disbursed! If an institution returns an application with remarks, it will automatically appear here for rapid rescue.
        </p>
        <Link
          to="/student/tracking"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tribal text-white text-xs font-bold hover:bg-tribal-dark"
        >
          Check Application Tracking
        </Link>
      </div>
    );
  }

  const app = selectedApp || returnedApps[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-700 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/20">
              <LifeBuoy className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100">
              Key Differentiator
            </span>
          </div>
          <h1 className="text-2xl font-extrabold mt-1">Application Rescue Center</h1>
          <p className="text-xs text-rose-100 mt-0.5">
            Never lose your scholarship due to minor document mistakes. Fix institution queries with guided step-by-step resolution.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white text-rose-700">
            1 Application Action Required
          </span>
        </div>
      </div>

      {/* Main Rescue Card */}
      <div className="bg-surface rounded-2xl border-2 border-rose-300 p-6 shadow-sm space-y-6">
        {/* Scheme & Application Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold text-gray-500">
              #{app.applicationNumber}
            </span>
            <h2 className="text-base font-extrabold text-gray-900 mt-0.5">
              {app.scholarshipName}
            </h2>
          </div>
          <div className="text-right text-xs">
            <span className="text-gray-500 block">Correction Deadline:</span>
            <strong className="text-rose-600 font-bold">
              {app.correctionDeadline || "2026-10-25"} (Verified Available)
            </strong>
          </div>
        </div>

        {/* Reason for Return from Institution */}
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Reason for Return (Nodal Officer Scrutiny Observation):</span>
          </div>
          <p className="text-xs text-rose-800 mt-1.5 font-medium leading-relaxed">
            {app.returnedReason}
          </p>
        </div>

        {/* Step-by-Step Fix Guide */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-saffron" /> How to Fix & Resubmit (Action Plan)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="w-5 h-5 rounded-full bg-saffron text-white font-bold flex items-center justify-center text-[10px] mb-2">
                1
              </span>
              <strong className="block text-gray-900 mb-1">Obtain Clarification</strong>
              <p className="text-gray-600 text-[11px]">
                Get Tahsildar revenue endorsement or spelling affidavit.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="w-5 h-5 rounded-full bg-saffron text-white font-bold flex items-center justify-center text-[10px] mb-2">
                2
              </span>
              <strong className="block text-gray-900 mb-1">Select from Vault</strong>
              <p className="text-gray-600 text-[11px]">
                Choose the updated certificate uploaded in your Vault.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="w-5 h-5 rounded-full bg-saffron text-white font-bold flex items-center justify-center text-[10px] mb-2">
                3
              </span>
              <strong className="block text-gray-900 mb-1">Add Resubmit Note</strong>
              <p className="text-gray-600 text-[11px]">
                Summarize the correction for the scrutiny officer.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] mb-2">
                4
              </span>
              <strong className="block text-emerald-900 mb-1">Click Fix & Resubmit</strong>
              <p className="text-emerald-700 text-[11px]">
                Application returns to scrutiny queue with priority.
              </p>
            </div>
          </div>
        </div>

        {/* Action Form */}
        <div className="pt-4 border-t border-gray-100 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Select Replacement / Clarification Certificate from Vault:
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full max-w-md px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title} ({doc.certificateNumber || "Verified"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Clarification Remarks for Nodal Officer:
            </label>
            <textarea
              rows={3}
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
            />
          </div>

          {/* Submission and Confirmation */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-gray-500">
              ℹ️ Resubmission directly notifies the Nodal Officer at your college.
            </span>

            <button
              onClick={handleFixAndResubmit}
              disabled={resubmitting}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              {resubmitting ? "Resubmitting..." : "FIX & RESUBMIT NOW"}
            </button>
          </div>
        </div>

        {/* Correction History */}
        {app.correctionHistory && app.correctionHistory.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 mb-2">Correction History Log:</h4>
            <div className="space-y-1.5">
              {app.correctionHistory.map((hist, hIdx) => (
                <div key={hIdx} className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                  <span><strong>Reason:</strong> {hist.reason}</span>
                  <span className="text-gray-400">{hist.returnedAt.split("T")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
