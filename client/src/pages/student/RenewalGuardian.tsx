import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Send,
  Calendar,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { api } from "../../services/api";
import { RenewalRecord } from "../../types";

export const RenewalGuardian: React.FC = () => {
  const [renewals, setRenewals] = useState<RenewalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRenewals();
  }, []);

  const loadRenewals = () => {
    api.getRenewals().then((res) => {
      if (res.success) setRenewals(res.data);
      setLoading(false);
    });
  };

  const handleStartRenewal = async (id: string) => {
    setSubmitting(true);
    try {
      const res = await api.submitRenewal(id);
      if (res.success) {
        alert("Renewal application submitted successfully for Academic Year 2025-2026!");
        loadRenewals();
      }
    } catch (e) {
      alert("Error submitting renewal.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Loading Renewal Guardian...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/20">
              <RefreshCw className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Disbursement Continuation Protector
            </span>
          </div>
          <h1 className="text-2xl font-extrabold mt-1">Renewal Guardian</h1>
          <p className="text-xs text-amber-100 mt-0.5">
            Never let administrative renewal deadlines interrupt your educational funding. Automated document alerts and single-click continuity renewal.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white text-amber-800">
            Window Active: AY 2025-26
          </span>
        </div>
      </div>

      {renewals.length === 0 ? (
        <div className="bg-surface p-12 rounded-2xl border border-gray-200 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-sm text-gray-900">No active renewals pending</h3>
          <p className="text-xs text-gray-500">
            When a multi-year scholarship is disbursed, the Renewal Guardian will automatically open 45 days prior to the new academic year.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {renewals.map((ren) => (
            <div
              key={ren.id}
              className="bg-surface rounded-2xl border-2 border-amber-300 p-6 shadow-sm space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    RENEWAL IN {ren.daysRemaining} DAYS
                  </span>
                  <h2 className="text-base font-extrabold text-gray-900 mt-1">
                    {ren.scholarshipName}
                  </h2>
                </div>
                <div className="text-right text-xs">
                  <span className="text-gray-400 block">Renewal Window Closes:</span>
                  <strong className="text-rose-600 font-bold">{ren.renewalDeadline}</strong>
                </div>
              </div>

              {/* Status and Requirements Checklist */}
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Renewal Requirements Checklist:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-emerald-950 block">Marksheet (Pass Grade)</strong>
                      <span className="text-[11px] text-emerald-700">✓ Verified ({ren.previousYearMarksPercent}% CGPA)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-emerald-950 block">Bonafide Certificate</strong>
                      <span className="text-[11px] text-emerald-700">✓ 85% Attendance certified</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-amber-950 block">Annual Income Decl.</strong>
                      <span className="text-[11px] text-amber-800">Pending self-affirmation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-gray-500">
                  Current Status: <strong className="text-gray-900">{ren.status}</strong>
                </span>

                {ren.status === "SUBMITTED" ? (
                  <span className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Renewal Submitted & Under Verification
                  </span>
                ) : (
                  <button
                    onClick={() => handleStartRenewal(ren.id)}
                    disabled={submitting}
                    className="px-6 py-2.5 bg-tribal hover:bg-tribal-dark text-white font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" /> {submitting ? "Processing..." : "START RENEWAL NOW"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
