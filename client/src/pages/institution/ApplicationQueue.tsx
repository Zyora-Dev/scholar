import React, { useState, useEffect } from "react";
import {
  ListOrdered,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { api } from "../../services/api";
import { ApplicationStatusBadge } from "../../components/Badges";
import { Application } from "../../types";

export const ApplicationQueue: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [remarks, setRemarks] = useState("Verified against college student register.");
  const [returnReason, setReturnReason] = useState("Income certificate spelling requires Taluk clarification.");
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = () => {
    api.getInstitutionApplications().then((res) => {
      if (res.success) setApplications(res.data);
      setLoading(false);
    });
  };

  const handleAction = async (action: "RECOMMEND" | "REQUEST_CORRECTION" | "REJECT") => {
    if (!selectedApp) return;
    setActionInProgress(true);
    try {
      const res = await api.institutionAction(
        selectedApp.id,
        action,
        remarks,
        action === "REQUEST_CORRECTION" ? returnReason : undefined
      );
      if (res.success) {
        alert(`Application successfully updated with action: ${action}`);
        setSelectedApp(null);
        loadApps();
      }
    } catch (e) {
      alert("Error submitting scrutiny action.");
    } finally {
      setActionInProgress(false);
    }
  };

  const filtered =
    filterStatus === "ALL"
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Loading Scrutiny Queue...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-tribal/10 text-tribal">
            Scrutiny & Endorsement Portal
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">Verification Queue</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Examine student certificates, verify academic attendance records, review AI mismatch flags, and recommend for DBT sanction.
          </p>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-tribal"
          >
            <option value="ALL">All Application Stages</option>
            <option value="INSTITUTION_VERIFICATION">Pending Scrutiny Only</option>
            <option value="INSTITUTION_RECOMMENDED">Recommended to State</option>
            <option value="RETURNED">Returned for Correction</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-surface rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">Showing {filtered.length} Applications</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Application No</th>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4">Scheme</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                    {app.applicationNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <strong className="text-gray-900 block">{app.personalDetails?.fullName || "Indhira Iyappan"}</strong>
                    <span className="text-[11px] text-tribal font-semibold">
                      {app.personalDetails?.stCommunity || "Irula"} Tribe • {app.personalDetails?.district || "Nilgiris"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-gray-700 font-medium">
                    {app.scholarshipName}
                  </td>
                  <td className="py-3.5 px-4">
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 rounded-lg bg-tribal hover:bg-tribal-dark text-white font-bold text-xs shadow-xs"
                    >
                      Review & Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VERIFICATION REVIEW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-2xl border border-gray-200 max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-gray-400">
                  #{selectedApp.applicationNumber}
                </span>
                <h3 className="font-extrabold text-base text-gray-900">
                  Scrutiny & Verification Review
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Applicant Summary */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block">Student:</span>
                <strong className="text-gray-900">{selectedApp.personalDetails?.fullName || "Indhira Iyappan"}</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">ST Community:</span>
                <strong className="text-tribal">{selectedApp.personalDetails?.stCommunity || "Irula"}</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Income Reported:</span>
                <strong className="text-gray-900">
                  ₹{selectedApp.personalDetails?.annualFamilyIncome?.toLocaleString("en-IN") || "1,40,000"}
                </strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Academic Marks:</span>
                <strong className="text-gray-900">{selectedApp.educationDetails?.percentage || 84.5}%</strong>
              </div>
            </div>

            {/* AI Flags Observation Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">AI Document Pre-Scrutiny Signal:</strong>
                Income Certificate has a single-letter phonetic variation ('Indhira Iyyappan' vs 'Indhira Iyappan'). Student ST category matches district Irula registry.
              </div>
            </div>

            {/* Scrutiny Checklist */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gray-800">Mandatory Scrutiny Checklist:</h4>
              <div className="space-y-1.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <label className="flex items-center gap-2 font-medium text-gray-800 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-tribal focus:ring-tribal" />
                  Scheduled Tribe category confirmed against Tamil Nadu revenue registry
                </label>
                <label className="flex items-center gap-2 font-medium text-gray-800 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-tribal focus:ring-tribal" />
                  Regular enrollment &amp; attendance &gt; 75% verified in college records
                </label>
                <label className="flex items-center gap-2 font-medium text-gray-800 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-tribal focus:ring-tribal" />
                  No duplicate institutional hostel allowance claimed
                </label>
              </div>
            </div>

            {/* Remarks / Return Reason Form */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Nodal Officer Scrutiny Remarks (Appears in Audit Trail):
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-tribal"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-800 mb-1">
                  Return Reason (Required only if returning to student for correction):
                </label>
                <input
                  type="text"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAction("REQUEST_CORRECTION")}
                  disabled={actionInProgress}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  Return to Student (Rescue)
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("RECOMMEND")}
                  disabled={actionInProgress}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Recommend for State Sanction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
