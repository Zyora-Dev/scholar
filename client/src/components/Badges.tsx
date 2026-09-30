import React from "react";
import { CheckCircle2, AlertTriangle, Clock, AlertCircle, ShieldCheck, Sparkles } from "lucide-react";
import { VerificationStatus, ApplicationStatus } from "../types";

export const VerificationBadge: React.FC<{ status: VerificationStatus; className?: string }> = ({
  status,
  className = ""
}) => {
  switch (status) {
    case "VERIFIED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Verified Official Source
        </span>
      );
    case "DEMO":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300 ${className}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Demo Data
        </span>
      );
    case "PENDING_VERIFICATION":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Pending Verification
        </span>
      );
    case "EXPIRED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-gray-500" />
          Expired
        </span>
      );
    default:
      return null;
  }
};

export const ApplicationStatusBadge: React.FC<{ status: ApplicationStatus; className?: string }> = ({
  status,
  className = ""
}) => {
  switch (status) {
    case "DRAFT":
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 ${className}`}>
          Draft
        </span>
      );
    case "SUBMITTED":
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300 ${className}`}>
          <Clock className="w-3.5 h-3.5" /> Submitted
        </span>
      );
    case "INSTITUTION_VERIFICATION":
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-300 ${className}`}>
          <Clock className="w-3.5 h-3.5" /> Institution Verification
        </span>
      );
    case "INSTITUTION_RECOMMENDED":
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-300 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Recommended by Institution
        </span>
      );
    case "DEPARTMENT_REVIEW":
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-300 ${className}`}>
          <Clock className="w-3.5 h-3.5" /> Department Review
        </span>
      );
    case "APPROVED":
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved
        </span>
      );
    case "RETURNED":
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Needs Correction / Returned
        </span>
      );
    case "REJECTED":
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300 ${className}`}>
          <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Rejected
        </span>
      );
    case "DISBURSED":
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-400 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Disbursed (DBT)
        </span>
      );
    case "RENEWAL":
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300 ${className}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600" /> Renewal Cycle
        </span>
      );
    default:
      return null;
  }
};

export const MatchScoreBadge: React.FC<{ score: number; className?: string }> = ({ score, className = "" }) => {
  const color =
    score >= 85
      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
      : score >= 60
      ? "bg-amber-50 text-amber-800 border-amber-300"
      : "bg-rose-50 text-rose-800 border-rose-300";

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color} ${className}`}>
      <Sparkles className="w-3.5 h-3.5" />
      {score}% AI Match
    </span>
  );
};
